import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

/**
 * GET /api/friends/search?q=query&limit=10
 * Search for users by name or email
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: "Search query must be at least 2 characters" 
      }, { status: 400 });
    }

    await connectToDatabase();
    
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Search users by name or email (case-insensitive)
    const searchRegex = new RegExp(query.trim(), 'i');
    const users = await User.find({
      $and: [
        {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
          ],
        },
        // Exclude current user from results
        { _id: { $ne: currentUser._id } },
      ],
    })
      .select('name email image socialStats')
      .limit(Math.min(limit, 50)) // Max 50 results
      .lean();

    // Format results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = users.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      stats: {
        friendsCount: user.socialStats?.friendsCount || 0,
        watchlistCount: user.socialStats?.watchlistCount || 0,
      },
    }));

    return NextResponse.json({
      results,
      total: results.length,
      query: query.trim(),
    });

  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

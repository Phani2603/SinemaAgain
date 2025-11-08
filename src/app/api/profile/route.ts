import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate some real-time stats
    const stats = {
      moviesWatched: user.profile.favoriteMovies?.length || 0,
      averageRating: 4.2, // This would be calculated from actual ratings
      favoriteGenres: user.profile.favoriteGenres || ["Action", "Sci-Fi", "Drama"],
      friendsCount: user.socialStats.friendsCount,
      watchlistCount: user.socialStats.watchlistCount,
      joinDate: user.createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      bio: user.profile.bio || "",
      location: "", // Add this field to user model if needed
      preferences: user.preferences,
    };

    return NextResponse.json({ 
      ...stats,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
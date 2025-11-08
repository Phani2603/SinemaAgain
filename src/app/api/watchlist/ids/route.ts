import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

// Get user's watchlist IDs only (for efficient checking)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email }).select('watchlist');
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      watchlistIds: user.watchlist || [],
      total: user.watchlist?.length || 0
    });

  } catch (error) {
    console.error("Watchlist IDs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
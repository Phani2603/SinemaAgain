import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

// Check if a specific movie is in user's watchlist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ movieId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await params;
    const movieIdNum = parseInt(movieId);

    if (isNaN(movieIdNum)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isInWatchlist = user.watchlist.includes(movieIdNum);

    return NextResponse.json({ 
      isInWatchlist,
      movieId: movieIdNum
    });

  } catch (error) {
    console.error("Check watchlist status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
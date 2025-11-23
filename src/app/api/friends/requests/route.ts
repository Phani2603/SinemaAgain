import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Friendship from "@/models/Friendship";

/**
 * GET /api/friends/requests
 * Get all pending friend requests (received and sent)
 */
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

    // Get pending requests received by user
    const receivedRequests = await Friendship.getPendingRequests(user._id.toString());
    
    // Get requests sent by user
    const sentRequests = await Friendship.getSentRequests(user._id.toString());

    return NextResponse.json({
      received: receivedRequests.map(req => ({
        id: req._id,
        user: req.requester,
        createdAt: req.createdAt,
      })),
      sent: sentRequests.map(req => ({
        id: req._id,
        user: req.recipient,
        createdAt: req.createdAt,
      })),
      totalReceived: receivedRequests.length,
      totalSent: sentRequests.length,
    });

  } catch (error) {
    console.error("Get friend requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

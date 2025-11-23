import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Friendship from "@/models/Friendship";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * POST /api/friends/request/[id]
 * Accept a friend request
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: friendshipId } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(friendshipId)) {
      return NextResponse.json({ error: "Invalid friendship ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friendship request
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    // Verify the user is the recipient of the request
    if (friendship.recipient.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized to accept this request" }, { status: 403 });
    }

    // Check if already accepted
    if (friendship.status === 'accepted') {
      return NextResponse.json({ error: "Friend request already accepted" }, { status: 400 });
    }

    // Check if request is pending
    if (friendship.status !== 'pending') {
      return NextResponse.json({ error: "Invalid request status" }, { status: 400 });
    }

    // Accept the friend request
    friendship.status = 'accepted';
    friendship.acceptedAt = new Date();
    await friendship.save();

    // Update both users' friend counts
    const requester = await User.findById(friendship.requester);
    if (requester) {
      const requesterFriends = await Friendship.getFriends(requester._id.toString());
      requester.socialStats.friendsCount = requesterFriends.length;
      await requester.save();
    }

    const recipientFriends = await Friendship.getFriends(user._id.toString());
    user.socialStats.friendsCount = recipientFriends.length;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Friend request accepted",
      friendship: {
        id: friendship._id,
        status: friendship.status,
        acceptedAt: friendship.acceptedAt,
      },
    });

  } catch (error) {
    console.error("Accept friend request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/friends/request/[id]
 * Reject a friend request
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: friendshipId } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(friendshipId)) {
      return NextResponse.json({ error: "Invalid friendship ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friendship request
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return NextResponse.json({ error: "Friend request not found" }, { status: 404 });
    }

    // Verify the user is the recipient of the request
    if (friendship.recipient.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized to reject this request" }, { status: 403 });
    }

    // Delete the friendship request (rejection = deletion)
    await Friendship.findByIdAndDelete(friendshipId);

    return NextResponse.json({
      success: true,
      message: "Friend request rejected",
    });

  } catch (error) {
    console.error("Reject friend request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

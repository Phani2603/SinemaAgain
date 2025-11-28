import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Friendship from "@/models/Friendship";
import mongoose from "mongoose";

/**
 * GET /api/friends
 * Get all friends for the authenticated user
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

    // Get all accepted friends
    const friends = await Friendship.getFriends(user._id.toString());

    // Enrich friend data with stats
    const enrichedFriends = await Promise.all(
      friends.map(async (friend) => {
        const friendUser = await User.findById(friend._id);
        if (!friendUser) return null;

        // Calculate common movies (intersection of watchlists)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commonMovies = user.watchlist.filter((movieId: any) =>
          friendUser.watchlist.includes(movieId)
        );

        return {
          _id: friend._id.toString(),
          name: friend.name,
          email: friend.email,
          image: friend.image,
          friendshipId: friend.friendshipId,
          friendsSince: friend.friendsSince,
          stats: {
            moviesWatched: friendUser.watchlist.length,
            commonMovies: commonMovies.length,
            mutualFriends: 0, // Can be calculated if needed
          },
        };
      })
    );

    const validFriends = enrichedFriends.filter(f => f !== null);

    return NextResponse.json({
      friends: validFriends,
      total: validFriends.length,
    });

  } catch (error) {
    console.error("Get friends error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/friends
 * Send a friend request
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId } = await request.json();
    
    if (!recipientId) {
      return NextResponse.json({ error: "Recipient ID is required" }, { status: 400 });
    }

    // Validate recipientId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return NextResponse.json({ error: "Invalid recipient ID" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    // Can't send friend request to yourself
    if (user._id.toString() === recipientId) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 });
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await Friendship.findFriendship(
      user._id.toString(),
      recipientId
    );

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return NextResponse.json({ error: "Already friends" }, { status: 400 });
      }
      if (existingFriendship.status === 'pending') {
        return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
      }
      if (existingFriendship.status === 'blocked') {
        return NextResponse.json({ error: "Cannot send friend request" }, { status: 400 });
      }
    }

    // Create new friend request
    const friendship = await Friendship.create({
      requester: user._id,
      recipient: recipientId,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      message: "Friend request sent",
      friendshipId: friendship._id,
    }, { status: 201 });

  } catch (error) {
    console.error("Send friend request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/friends
 * Remove a friend or cancel a friend request
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendshipId } = await request.json();
    
    if (!friendshipId) {
      return NextResponse.json({ error: "Friendship ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the friendship
    const friendship = await Friendship.findById(friendshipId);
    if (!friendship) {
      return NextResponse.json({ error: "Friendship not found" }, { status: 404 });
    }

    // Verify user is part of this friendship
    const isRequester = friendship.requester.toString() === user._id.toString();
    const isRecipient = friendship.recipient.toString() === user._id.toString();

    if (!isRequester && !isRecipient) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the friendship
    await Friendship.findByIdAndDelete(friendshipId);

    // Update user's friend count
    const updatedFriends = await Friendship.getFriends(user._id.toString());
    user.socialStats.friendsCount = updatedFriends.length;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Friendship removed",
    });

  } catch (error) {
    console.error("Remove friend error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

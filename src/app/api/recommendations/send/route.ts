import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MovieRecommendation from '@/models/MovieRecommendation';
import Friendship from '@/models/Friendship';
import Notification from '@/models/Notification';

// POST /api/recommendations/send - Send movie recommendations to friends
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { friendIds, movieId, message, movieTitle } = body;

    if (!friendIds || !Array.isArray(friendIds) || friendIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one friend must be selected' },
        { status: 400 }
      );
    }

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify all recipients are friends
    const friendships = await Friendship.find({
      $or: [
        { requester: currentUser._id, recipient: { $in: friendIds }, status: 'accepted' },
        { recipient: currentUser._id, requester: { $in: friendIds }, status: 'accepted' },
      ],
    });

    const validFriendIds = new Set(
      friendships.map((f) =>
        f.requester.toString() === currentUser._id.toString()
          ? f.recipient.toString()
          : f.requester.toString()
      )
    );

    const invalidFriends = friendIds.filter((id) => !validFriendIds.has(id));
    if (invalidFriends.length > 0) {
      return NextResponse.json(
        { error: 'Some selected users are not your friends' },
        { status: 403 }
      );
    }

    // Create recommendations (skip if already exists)
    const recommendations = await Promise.all(
      friendIds.map(async (friendId) => {
        const existing = await MovieRecommendation.exists(
          currentUser._id.toString(),
          friendId,
          movieId
        );

        if (existing) {
          return { friendId, status: 'already_sent' };
        }

        const recommendation = await MovieRecommendation.create({
          fromUser: currentUser._id,
          toUser: friendId,
          movieId,
          message: message || undefined,
          status: 'pending',
        });

        // Create notification for the recipient
        await Notification.create({
          recipient: friendId,
          sender: currentUser._id,
          type: 'movie_recommendation',
          movieId,
          movieTitle: movieTitle || `Movie #${movieId}`,
          message: message || undefined,
          read: false,
        });

        return { friendId, status: 'sent', recommendation };
      })
    );

    const sentCount = recommendations.filter((r) => r.status === 'sent').length;
    const alreadySentCount = recommendations.filter((r) => r.status === 'already_sent').length;

    return NextResponse.json({
      success: true,
      sent: sentCount,
      alreadySent: alreadySentCount,
      message: `Sent to ${sentCount} friend${sentCount !== 1 ? 's' : ''}${
        alreadySentCount > 0 ? `, ${alreadySentCount} already recommended` : ''
      }`,
    });
  } catch (error) {
    console.error('Failed to send recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to send recommendations' },
      { status: 500 }
    );
  }
}

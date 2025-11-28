import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MovieRecommendation from '@/models/MovieRecommendation';

// GET /api/recommendations/received - Get movie recommendations received from friends
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const User = (await import('@/models/User')).default;
    const currentUser = await User.findOne({ email: session.user.email });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const recommendations = await MovieRecommendation.getReceivedRecommendations(
      currentUser._id.toString(),
      limit
    );

    // Group by movieId to show all friends who recommended each movie
    interface PopulatedRecommendation {
      movieId: number;
      message?: string;
      status: 'pending' | 'viewed' | 'watched';
      createdAt: Date;
      fromUser: {
        _id: string;
        name: string;
        email: string;
        image?: string;
      };
    }

    interface GroupedRecommendation {
      movieId: number;
      recommendations: Array<{
        from: {
          _id: string;
          name: string;
          email: string;
          image?: string;
        };
        message?: string;
        status: string;
        createdAt: Date;
      }>;
    }

    const groupedByMovie = recommendations.reduce((acc: Record<string, GroupedRecommendation>, rec: PopulatedRecommendation) => {
      const key = rec.movieId.toString();
      if (!acc[key]) {
        acc[key] = {
          movieId: rec.movieId,
          recommendations: [],
        };
      }
      acc[key].recommendations.push({
        from: {
          _id: rec.fromUser._id,
          name: rec.fromUser.name,
          email: rec.fromUser.email,
          image: rec.fromUser.image,
        },
        message: rec.message,
        status: rec.status,
        createdAt: rec.createdAt,
      });
      return acc;
    }, {});

    const movieRecommendations = Object.values(groupedByMovie);

    return NextResponse.json({
      success: true,
      count: movieRecommendations.length,
      recommendations: movieRecommendations,
    });
  } catch (error) {
    console.error('Failed to fetch recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

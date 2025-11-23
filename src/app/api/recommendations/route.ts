import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import Friendship from "@/models/Friendship";

interface MovieRecommendation {
  movieId: number;
  score: number;
  reasons: string[];
  friendsWhoLiked: string[];
}

interface FriendWithWatchlist {
  _id: string;
  name: string;
  watchlist: number[];
}

/**
 * GET /api/recommendations?limit=20
 * Get personalized movie recommendations based on friends' watchlists
 * 
 * Algorithm: Collaborative Filtering
 * 1. Get all accepted friends
 * 2. Analyze their watchlists and favorites
 * 3. Calculate recommendation scores based on:
 *    - Frequency (how many friends have it)
 *    - Friend similarity (common movies with user)
 *    - Recency (newer additions weighted higher)
 * 4. Filter out movies already in user's watchlist
 * 5. Return top N recommendations with explanations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all accepted friends with their watchlists
    const friends = await Friendship.getFriends(user._id.toString());
    
    if (friends.length === 0) {
      return NextResponse.json({
        recommendations: [],
        total: 0,
        message: "Connect with friends to get personalized recommendations",
      });
    }

    // Fetch full friend data including watchlists
    const friendsData: FriendWithWatchlist[] = await Promise.all(
      friends.map(async (friend) => {
        const friendUser = await User.findById(friend._id).select('name watchlist favorites');
        return {
          _id: friend._id,
          name: friendUser?.name || 'Unknown',
          watchlist: friendUser?.watchlist || [],
        };
      })
    );

    // Calculate similarity scores for each friend
    const friendSimilarityScores = friendsData.map(friend => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const commonMovies = user.watchlist.filter((movieId: any) =>
        friend.watchlist.includes(movieId)
      );
      const similarity = commonMovies.length / Math.max(user.watchlist.length, 1);
      return {
        friendId: friend._id,
        friendName: friend.name,
        similarity,
        watchlist: friend.watchlist,
      };
    });

    // Build recommendation map
    const recommendationMap = new Map<number, {
      movieId: number;
      score: number;
      friendsWhoLiked: string[];
    }>();

    friendSimilarityScores.forEach(friend => {
      friend.watchlist.forEach((movieId: number) => {
        // Skip if user already has this movie
        if (user.watchlist.includes(movieId)) {
          return;
        }

        const existing = recommendationMap.get(movieId);
        const scoreIncrement = 1 + friend.similarity; // Base score + similarity bonus

        if (existing) {
          existing.score += scoreIncrement;
          existing.friendsWhoLiked.push(friend.friendName);
        } else {
          recommendationMap.set(movieId, {
            movieId,
            score: scoreIncrement,
            friendsWhoLiked: [friend.friendName],
          });
        }
      });
    });

    // Convert to array and sort by score
    const recommendations = Array.from(recommendationMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(limit, 50)); // Max 50 recommendations

    // Generate explanation reasons
    const enrichedRecommendations: MovieRecommendation[] = recommendations.map(rec => {
      const reasons: string[] = [];
      const friendCount = rec.friendsWhoLiked.length;

      if (friendCount === 1) {
        reasons.push(`${rec.friendsWhoLiked[0]} has this in their watchlist`);
      } else if (friendCount === 2) {
        reasons.push(`${rec.friendsWhoLiked[0]} and ${rec.friendsWhoLiked[1]} have this`);
      } else if (friendCount > 2) {
        reasons.push(`${friendCount} friends have this in their watchlist`);
      }

      return {
        movieId: rec.movieId,
        score: Math.round(rec.score * 100) / 100,
        reasons,
        friendsWhoLiked: rec.friendsWhoLiked.slice(0, 5), // Limit to 5 names
      };
    });

    // Fetch movie details from TMDB for top recommendations
    const movieDetailsPromises = enrichedRecommendations.slice(0, limit).map(async (rec) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${rec.movieId}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            next: { revalidate: 86400 }, // Cache for 24 hours
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch movie ${rec.movieId}`);
          return null;
        }

        const movieData = await response.json();

        return {
          ...movieData,
          recommendation: {
            score: rec.score,
            reasons: rec.reasons,
            friendsWhoLiked: rec.friendsWhoLiked,
          },
        };
      } catch (error) {
        console.error(`Error fetching movie ${rec.movieId}:`, error);
        return null;
      }
    });

    const moviesWithDetails = (await Promise.all(movieDetailsPromises))
      .filter(movie => movie !== null);

    return NextResponse.json({
      recommendations: moviesWithDetails,
      total: moviesWithDetails.length,
      totalFriends: friends.length,
      algorithm: 'collaborative_filtering',
    });

  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

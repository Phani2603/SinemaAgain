import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";

// Define movie type
interface MovieWithWatchlistInfo {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  added_at: string;
  priority: string;
}

// Get user's watchlist
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

    // Get movie details for watchlist items from TMDB with better error handling
    const movieIds = user.watchlist || [];
    const movies: MovieWithWatchlistInfo[] = [];
    
    // Implement concurrent requests with Promise.allSettled for better performance
    const moviePromises = movieIds.map(async (movieId: number) => {
      return fetchMovieWithRetry(movieId, 3); // 3 retry attempts
    });

    const results = await Promise.allSettled(moviePromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        movies.push({
          ...result.value,
          added_at: new Date().toISOString(), // You can store this in user model
          priority: "medium", // Default priority, can be stored in user model
        });
      } else {
        console.warn(`Failed to fetch movie ${movieIds[index]}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
      }
    });

    return NextResponse.json({ 
      movies,
      total: movies.length,
      totalRequested: movieIds.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Watchlist API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Helper function to fetch movie with retry logic
async function fetchMovieWithRetry(movieId: number, maxRetries: number): Promise<Record<string, unknown> | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        { 
          headers: {
            'Authorization': `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        // Movie not found, don't retry
        console.warn(`Movie ${movieId} not found on TMDB`);
        return null;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Attempt ${attempt}/${maxRetries} failed for movie ${movieId}:`, errorMessage);
      
      if (attempt === maxRetries) {
        // Last attempt failed
        return null;
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return null;
}

// Add movie to watchlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await request.json();
    
    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add movie to watchlist using the model method
    user.addToWatchlist(movieId);
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Movie added to watchlist",
      watchlistCount: user.watchlist.length
    });

  } catch (error) {
    console.error("Add to watchlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Remove movie from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { movieId } = await request.json();
    
    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove movie from watchlist using the model method
    user.removeFromWatchlist(movieId);
    user.socialStats.watchlistCount = user.watchlist.length;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: "Movie removed from watchlist",
      watchlistCount: user.watchlist.length
    });

  } catch (error) {
    console.error("Remove from watchlist error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
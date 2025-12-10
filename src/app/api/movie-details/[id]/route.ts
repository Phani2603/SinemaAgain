import { NextRequest, NextResponse } from 'next/server';
import { fetchTMDB } from '@/lib/tmdb-api';
import type { MovieDetails } from '@/lib/tmdb-api';
import { getCached, TTL } from '@/lib/cache';

// GET /api/movie-details/[id] - Get movie details from TMDB
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Cache movie details for 1 hour (movie data doesn't change often)
    const movie = await getCached(
      `movie:${movieId}`,
      TTL.ONE_HOUR,
      async () => {
        return await fetchTMDB<MovieDetails>({ 
          path: `/movie/${movieId}`,
          query: { append_to_response: 'videos,credits' }
        });
      }
    );

    return NextResponse.json(movie);
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}

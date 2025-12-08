const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Error handling types
interface NetworkError extends Error {
  code?: string;
  cause?: {
    message?: string;
    code?: string;
  };
}

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  adult: boolean;
};

export type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string | null;
  status: string;
  homepage: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string | null;
    }[];
  };
  images?: {
    backdrops: {
      file_path: string;
      width: number;
      height: number;
    }[];
    posters: {
      file_path: string;
      width: number;
      height: number;
    }[];
    logos: {
      file_path: string;
      width: number;
      height: number;
    }[];
  };
};

export type PersonDetails = {
  id: number;
  name: string;
  biography: string | null;
  profile_path: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string | null;
  also_known_as: string[];
  gender: number;
  homepage: string | null;
  combined_credits?: {
    cast: Array<{
      id: number;
      media_type: "movie" | "tv";
      title?: string;
      name?: string;
      character?: string;
      poster_path: string | null;
      release_date?: string;
      first_air_date?: string;
      vote_average?: number;
    }>;
    crew: Array<{
      id: number;
      media_type: "movie" | "tv";
      title?: string;
      name?: string;
      job?: string;
      poster_path: string | null;
      release_date?: string;
      first_air_date?: string;
      vote_average?: number;
    }>;
  };
};

type FetchOptions = {
  path: string;
  query?: Record<string, string>;
};

// Use Bearer Token method (preferred) with retry logic
export const fetchTMDB = async <T = unknown>({ path, query = {} }: FetchOptions, retryCount = 0): Promise<T> => {
  // Validate API token
  const apiToken = process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN;
  if (!apiToken) {
    console.error('❌ TMDB API Token is missing! Please set NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN in your .env.local file');
    throw new Error('TMDB API configuration error: Missing API token');
  }
  
  const queryParams = new URLSearchParams(query);
  const url = `${TMDB_BASE_URL}${path}?${queryParams}`;
  
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second
  
  try {
    // Use the read access token with Bearer authentication
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'SinemaAgain/1.0',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
      // Add timeout for better error handling
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });
    
    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error: unknown) {
    const networkError = error as NetworkError;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = networkError?.code || networkError?.cause?.code;
    const errorName = networkError?.name;
    
    // Better error logging
    console.error(`TMDB API Error (attempt ${retryCount + 1}):`, {
      url,
      message: errorMessage,
      cause: networkError?.cause?.message || 'Unknown cause',
      code: errorCode,
      name: errorName,
      fullError: error instanceof Error ? error.stack : String(error)
    });
    
    // Check if this is a network error that can be retried
    const isRetryableError = 
      errorCode === 'ECONNRESET' ||
      errorCode === 'ENOTFOUND' ||
      errorCode === 'ECONNREFUSED' ||
      errorCode === 'ETIMEDOUT' ||
      errorName === 'TimeoutError' ||
      errorName === 'AbortError' ||
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('network');
    
    // Retry logic for network errors
    if (isRetryableError && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Retrying TMDB request in ${delay}ms... (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchTMDB<T>({ path, query }, retryCount + 1);
    }
    
    // If all retries failed or it's not a retryable error
    if (retryCount >= maxRetries) {
      console.error(`TMDB API failed after ${maxRetries} retries for ${url}`);
      throw new Error(`TMDB API connection failed after ${maxRetries} attempts. Please check your internet connection and try again.`);
    }
    
    // Re-throw non-retryable errors (like 401, 404, etc.)
    throw error;
  }
};

// Helper functions for common endpoints
export const tmdbApi = {
  getPopularMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB<MovieResponse>({ path: '/movie/popular', query: { page: page.toString() } }),
  
  getTopRatedMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB<MovieResponse>({ path: '/movie/top_rated', query: { page: page.toString() } }),
  
  getNowPlayingMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB<MovieResponse>({ path: '/movie/now_playing', query: { page: page.toString() } }),
  
  getUpcomingMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB<MovieResponse>({ path: '/movie/upcoming', query: { page: page.toString() } }),
    
  getMovieDetails: (movieId: number | string): Promise<MovieDetails> => 
    fetchTMDB<MovieDetails>({ 
      path: `/movie/${movieId}`, 
      query: { append_to_response: 'videos,credits,images' } 
    }),
    
  searchMovies: (query: string, page = 1): Promise<MovieResponse> => 
    fetchTMDB<MovieResponse>({ 
      path: '/search/movie', 
      query: { query, page: page.toString() } 
    }),
    
  getMoviesByGenre: (genreId: number | string, page = 1): Promise<MovieResponse> =>
    fetchTMDB<MovieResponse>({
      path: '/discover/movie',
      query: { 
        with_genres: genreId.toString(),
        page: page.toString(),
        sort_by: 'popularity.desc'
      }
    }),
    
  getMovieRecommendations: (movieId: number | string, page = 1): Promise<MovieResponse> =>
    fetchTMDB<MovieResponse>({
      path: `/movie/${movieId}/recommendations`,
      query: { page: page.toString() }
    }),
    
  getGenres: (): Promise<{genres: {id: number; name: string}[]}> =>
    fetchTMDB<{genres: {id: number; name: string}[]}>({ path: '/genre/movie/list' }),

  getPersonDetails: (personId: number | string): Promise<PersonDetails> =>
    fetchTMDB<PersonDetails>({
      path: `/person/${personId}`,
      query: { append_to_response: 'combined_credits' }
    }),

  // Trending endpoints
  getTrendingMovies: (timeWindow: 'day' | 'week' = 'day'): Promise<MovieResponse> =>
    fetchTMDB<MovieResponse>({ path: `/trending/movie/${timeWindow}` }),

  // Advanced filtering for discover endpoint
  discoverMovies: (filters: {
    page?: number;
    genreId?: number;
    year?: number;
    minRating?: number;
    maxRating?: number;
    minRuntime?: number;
    maxRuntime?: number;
    sortBy?: string;
  } = {}): Promise<MovieResponse> => {
    const queryParams: Record<string, string> = {
      page: (filters.page || 1).toString(),
      sort_by: filters.sortBy || 'popularity.desc'
    };

    if (filters.genreId) queryParams.with_genres = filters.genreId.toString();
    if (filters.year) queryParams.year = filters.year.toString();
    if (filters.minRating) queryParams['vote_average.gte'] = filters.minRating.toString();
    if (filters.maxRating) queryParams['vote_average.lte'] = filters.maxRating.toString();
    if (filters.minRuntime) queryParams['with_runtime.gte'] = filters.minRuntime.toString();
    if (filters.maxRuntime) queryParams['with_runtime.lte'] = filters.maxRuntime.toString();

    return fetchTMDB<MovieResponse>({
      path: '/discover/movie',
      query: queryParams
    });
  },

  // Watch providers
  getMovieWatchProviders: (movieId: number | string, region = 'US'): Promise<{
    id: number;
    results: {
      [region: string]: {
        link: string;
        flatrate?: Array<{
          logo_path: string;
          provider_id: number;
          provider_name: string;
          display_priority: number;
        }>;
        rent?: Array<{
          logo_path: string;
          provider_id: number;
          provider_name: string;
          display_priority: number;
        }>;
        buy?: Array<{
          logo_path: string;
          provider_id: number;
          provider_name: string;
          display_priority: number;
        }>;
      };
    };
  }> => {
    type WatchProvidersResponse = {
      id: number;
      results: {
        [region: string]: {
          link: string;
          flatrate?: Array<{
            logo_path: string;
            provider_id: number;
            provider_name: string;
            display_priority: number;
          }>;
          rent?: Array<{
            logo_path: string;
            provider_id: number;
            provider_name: string;
            display_priority: number;
          }>;
          buy?: Array<{
            logo_path: string;
            provider_id: number;
            provider_name: string;
            display_priority: number;
          }>;
        };
      };
    };
    
    return fetchTMDB<WatchProvidersResponse>({
      path: `/movie/${movieId}/watch/providers`,
      query: { region }
    });
  },

  // User reviews
  getMovieReviews: (movieId: number | string, page = 1): Promise<{
    id: number;
    page: number;
    results: Array<{
      author: string;
      author_details: {
        name: string;
        username: string;
        avatar_path: string | null;
        rating: number | null;
      };
      content: string;
      created_at: string;
      id: string;
      updated_at: string;
      url: string;
    }>;
    total_pages: number;
    total_results: number;
  }> => {
    type ReviewsResponse = {
      id: number;
      page: number;
      results: Array<{
        author: string;
        author_details: {
          name: string;
          username: string;
          avatar_path: string | null;
          rating: number | null;
        };
        content: string;
        created_at: string;
        id: string;
        updated_at: string;
        url: string;
      }>;
      total_pages: number;
      total_results: number;
    };
    
    return fetchTMDB<ReviewsResponse>({
      path: `/movie/${movieId}/reviews`,
      query: { page: page.toString() }
    });
  }
};
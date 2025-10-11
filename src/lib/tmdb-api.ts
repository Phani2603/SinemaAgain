const TMDB_BASE_URL = "https://api.themoviedb.org/3";

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

// Use Bearer Token method (preferred)
export const fetchTMDB = async ({ path, query = {} }: FetchOptions) => {
  const queryParams = new URLSearchParams(query);
  const url = `${TMDB_BASE_URL}${path}?${queryParams}`;
  
  // Use the read access token with Bearer authentication
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }
  
  return await response.json();
};

// Helper functions for common endpoints
export const tmdbApi = {
  getPopularMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB({ path: '/movie/popular', query: { page: page.toString() } }),
  
  getTopRatedMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB({ path: '/movie/top_rated', query: { page: page.toString() } }),
  
  getNowPlayingMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB({ path: '/movie/now_playing', query: { page: page.toString() } }),
  
  getUpcomingMovies: (page = 1): Promise<MovieResponse> => 
    fetchTMDB({ path: '/movie/upcoming', query: { page: page.toString() } }),
    
  getMovieDetails: (movieId: number | string): Promise<MovieDetails> => 
    fetchTMDB({ 
      path: `/movie/${movieId}`, 
      query: { append_to_response: 'videos,credits' } 
    }),
    
  searchMovies: (query: string, page = 1): Promise<MovieResponse> => 
    fetchTMDB({ 
      path: '/search/movie', 
      query: { query, page: page.toString() } 
    }),
    
  getMoviesByGenre: (genreId: number | string, page = 1): Promise<MovieResponse> =>
    fetchTMDB({
      path: '/discover/movie',
      query: { 
        with_genres: genreId.toString(),
        page: page.toString(),
        sort_by: 'popularity.desc'
      }
    }),
    
  getMovieRecommendations: (movieId: number | string, page = 1): Promise<MovieResponse> =>
    fetchTMDB({
      path: `/movie/${movieId}/recommendations`,
      query: { page: page.toString() }
    }),
    
  getGenres: (): Promise<{genres: {id: number; name: string}[]}> =>
    fetchTMDB({ path: '/genre/movie/list' }),

  getPersonDetails: (personId: number | string): Promise<PersonDetails> =>
    fetchTMDB({
      path: `/person/${personId}`,
      query: { append_to_response: 'combined_credits' }
    })
};
import { tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import { MovieSearchBar } from "@/components/movie-contents/MovieSearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export default async function MoviesPage() {
  // Fetch data from TMDB API
  const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.all([
    tmdbApi.getPopularMovies(),
    tmdbApi.getTopRatedMovies(),
    tmdbApi.getUpcomingMovies(),
  ]);

  // Get genres for filtering
  const { genres } = await tmdbApi.getGenres();

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-primary/20 to-background border border-border rounded-2xl p-6 md:p-8 lg:p-12 mb-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover Movies
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            Explore thousands of movies, from blockbuster hits to hidden gems.
            Find your next favorite film.
          </p>
          
          {/* Search Component */}
          <MovieSearchBar />
        </div>
        
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-12 right-32 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </section>

      {/* Genre Filter */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Browse by Genre</h2>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button 
              key={genre.id}
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/movies/genre/${genre.id}`}>
                {genre.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Movie Sections */}
      <div className="space-y-12">
        <MovieGrid 
          movies={popularMovies.results.slice(0, 10)} 
          title="Popular Movies" 
        />
        
        <MovieGrid 
          movies={topRatedMovies.results.slice(0, 10)} 
          title="Top Rated Movies" 
        />
        
        <MovieGrid 
          movies={upcomingMovies.results.slice(0, 10)} 
          title="Upcoming Movies" 
        />
      </div>
    </div>
  );
}
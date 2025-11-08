import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import WatchProviders from "@/components/movie-contents/WatchProviders";
import UserReviews from "@/components/movie-contents/UserReviews";
import BackButton from "@/components/ui/back-button";
import WatchlistButton from "@/components/movie-contents/WatchlistButton";

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 3600; // Revalidate every hour

export default async function MoviePage({ params }: MoviePageProps) {
  // Await params before using them (Next.js 15 requirement)
  const { id } = await params;
  
  try {
    // Fetch movie details
    const movie = await tmdbApi.getMovieDetails(id);
    
    // Fetch recommendations
    const recommendations = await tmdbApi.getMovieRecommendations(id);
    
    // Calculate poster and backdrop URLs
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : "/placeholder-poster.svg";
      
    const backdropUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "/placeholder-backdrop.svg";
    
    // Format runtime
    const formatRuntime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };
    
    // Format date
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }).format(date);
    };
    
    // Get director and main cast
    const director = movie.credits.crew.find(person => person.job === "Director");
    const cast = movie.credits.cast.slice(0, 5);
    
    // Get trailer
    const trailer = movie.videos.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    
    return (
      <div className="min-h-screen">
        {/* Hero Section with Backdrop */}
        <div className="relative w-full h-[60vh]">
          {/* Backdrop Image */}
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
          
          {/* Movie Info */}
          <div className="container max-w-7xl mx-auto relative h-full flex items-end pb-8 px-4">
            {/* Back control */}
            <div className="absolute top-4 left-4">
              <BackButton label="Back" fallbackHref="/movies" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-end">
              {/* Poster */}
              <div className="hidden md:block relative w-[200px] h-[300px] rounded-lg overflow-hidden shadow-2xl border border-border">
                <Image 
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Basic Info */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-lg text-primary italic mt-2">{movie.tagline}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre) => (
                    <Link 
                      href={`/movies/genre/${genre.id}`}
                      key={genre.id}
                      className="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div>⏱️ {formatRuntime(movie.runtime)}</div>
                  <div>📅 {formatDate(movie.release_date)}</div>
                  <div>⭐ {movie.vote_average.toFixed(1)}/10</div>
                </div>
                
                {/* Watchlist Button */}
                <div className="mt-6">
                  <WatchlistButton 
                    movieId={movie.id} 
                    movieTitle={movie.title}
                    className="px-6 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Left Column */}
            <div>
              {/* Overview */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-lg leading-relaxed">{movie.overview}</p>
              </section>
              
              {/* Trailer */}
              {trailer && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </section>
              )}
              
              {/* Cast */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {cast.map((person) => (
                    <Link href={`/people/${person.id}`} key={person.id} className="text-center group">
                      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 ring-1 ring-border group-hover:ring-primary transition">
                        <Image
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                              : "/placeholder-person.svg"
                          }
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{person.name}</h4>
                      <p className="text-xs text-muted-foreground">{person.character}</p>
                    </Link>
                  ))}
                </div>
              </section>
              
              {/* Recommendations */}
              {recommendations.results.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">You might also like</h2>
                  <MovieGrid movies={recommendations.results.slice(0, 10)} />
                </section>
              )}

              {/* User Reviews */}
              <section>
                <UserReviews movieId={parseInt(id)} />
              </section>
            </div>
            
            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Movie Poster (Mobile) */}
              <div className="md:hidden relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg border border-border">
                <Image 
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Key Details */}
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium">{movie.status}</dd>
                  </div>
                  
                  {director && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Director</dt>
                      <dd className="font-medium">{director.name}</dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm text-muted-foreground">Release Date</dt>
                    <dd className="font-medium">{formatDate(movie.release_date)}</dd>
                  </div>
                  
                  {movie.budget > 0 && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Budget</dt>
                      <dd className="font-medium">
                        ${movie.budget.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  
                  {movie.revenue > 0 && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Revenue</dt>
                      <dd className="font-medium">
                        ${movie.revenue.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  
                  {movie.homepage && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Website</dt>
                      <dd>
                        <a 
                          href={movie.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Official Website
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Watch Providers */}
              <WatchProviders movieId={parseInt(id)} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching movie:", error);
    notFound();
  }
}
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import WatchProviders from "@/components/movie-contents/WatchProviders";
import UserReviews from "@/components/movie-contents/UserReviews";
import BackButton from "@/components/ui/back-button";
import MovieActionButtons from "@/components/movie-contents/MovieActionButtons";
import BackToTop from "@/components/ui/BackToTop";
import FullCastDialog from "@/components/movie-contents/FullCastDialog";
import MovieBackdrop from "@/components/movie-contents/MovieBackdrop";

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
    
    // Calculate poster URL
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder-poster.svg";
    
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
    const cast = movie.credits.cast.slice(0, 7);
    const fullCast = movie.credits.cast;
    const hasMoreCast = movie.credits.cast.length > 7;
    
    // Get trailer
    const trailer = movie.videos.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    
    return (
      <div className="min-h-screen -mt-16">
        {/* Hero Section with Backdrop - Letterboxd Style */}
        <div className="relative w-full h-[55vh] md:h-[75vh] lg:h-[90vh] overflow-hidden rounded-b-2xl md:rounded-b-3xl lg:rounded-b-[6rem]">
          <MovieBackdrop 
            backdrops={movie.images?.backdrops || []}
            defaultBackdrop={movie.backdrop_path}
            movieTitle={movie.title}
          />
          
          {/* Back Button */}
          <div className="absolute top-20 left-4 md:left-6 z-20">
            <BackButton label="Back" fallbackHref="/movies" />
          </div>
        </div>
        
        {/* Content Section - Overlapping Poster */}
        <div className="container max-w-7xl mx-auto px-4 mt-12 md:-mt-16 lg:mt-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Poster - Overlapping with extra negative margin */}
            <div className="flex-shrink-0 -mt-24 md:-mt-40 lg:-mt-48">
              <div className="relative w-[180px] md:w-[230px] h-[270px] md:h-[345px] rounded-lg overflow-hidden shadow-2xl ring-4 ring-background">
                <Image 
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Movie Info */}
            <div className="flex-1 pt-4 md:pt-0">
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-jost font-bold text-foreground">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mt-2">{movie.tagline}</p>
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
                {director && <div>🎬 {director.name}</div>}
              </div>
              
              {/* Watchlist & Recommend Buttons */}
              <div className="mt-6 flex gap-3">
                <MovieActionButtons 
                  movieId={movie.id} 
                  movieTitle={movie.title}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Left Column */}
            <div>
              {/* Overview */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-xl leading-relaxed">{movie.overview}</p>
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Top Cast</h2>
                  {hasMoreCast && (
                    <FullCastDialog cast={fullCast} />
                  )}
                </div>
                
                {/* Horizontal Scrolling Carousel */}
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide pb-4">
                    <div className="flex gap-4 min-w-max">
                      {cast.map((person) => (
                        <Link 
                          href={`/people/${person.id}`} 
                          key={person.id} 
                          className="group flex-shrink-0"
                        >
                          <div className="w-32 sm:w-36">
                            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 ring-2 ring-border group-hover:ring-primary transition-all group-hover:scale-105 shadow-md">
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
                            <div className="space-y-1">
                              <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                {person.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {person.character}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Scroll Indicator Gradient */}
                  <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
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
        
        {/* Back to Top Button */}
        <BackToTop />
      </div>
    );
  } catch (error) {
    console.error("Error fetching movie:", error);
    notFound();
  }
}
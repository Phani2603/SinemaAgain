import { tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GenrePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600; // Revalidate every hour

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  // Await params and searchParams before using them (Next.js 15 requirement)
  const { id } = await params;
  const searchParamsResolved = await searchParams;
  
  const genreId = id;
  const page = typeof searchParamsResolved.page === "string" 
    ? parseInt(searchParamsResolved.page) 
    : 1;
  
  try {
    // Fetch genre name and movies by genre
    const [{ genres }, moviesByGenre] = await Promise.all([
      tmdbApi.getGenres(),
      tmdbApi.getMoviesByGenre(genreId, page)
    ]);
    
    const genre = genres.find(g => g.id.toString() === genreId);
    
    if (!genre) {
      notFound();
    }
    
    const totalPages = moviesByGenre.total_pages;
    
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/movies">
                ← Back to Movies
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{genre.name} Movies</h1>
          <p className="text-muted-foreground mt-2">
            Showing {moviesByGenre.results.length} of {moviesByGenre.total_results} movies
          </p>
        </div>
        
        <MovieGrid movies={moviesByGenre.results} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/movies/genre/${genreId}?page=${page - 1}`}>
                  Previous
                </Link>
              </Button>
            )}
            
            <span className="px-4 py-2 text-sm">
              Page {page} of {Math.min(totalPages, 500)}
            </span>
            
            {page < Math.min(totalPages, 500) && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/movies/genre/${genreId}?page=${page + 1}`}>
                  Next
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    notFound();
  }
}
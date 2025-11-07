import { tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import SearchBar from "@/components/movie-contents/SearchBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 0; // Do not cache this page

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await searchParams before using them (Next.js 15 requirement)
  const searchParamsResolved = await searchParams;
  
  const query: string = typeof searchParamsResolved.q === "string" ? searchParamsResolved.q : "";
  
  if (!query) {
    notFound();
  }
  
  const page = typeof searchParamsResolved.page === "string" 
    ? parseInt(searchParamsResolved.page) 
    : 1;
  
  try {
    const results = await tmdbApi.searchMovies(query, page);
    const { genres } = await tmdbApi.getGenres();
    const totalPages = Math.min(results.total_pages, 500); // TMDB API limits to 500 pages
    
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/movies">
                ← Back to Movies
              </Link>
            </Button>
            
            <div className="w-full md:w-1/2 lg:w-1/3">
              <SearchBar autoFocus />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Search Results for &ldquo;{query}&rdquo;</h1>
            <p className="text-muted-foreground">
              Found {results.total_results.toLocaleString()} results across {totalPages.toLocaleString()} pages
            </p>
          </div>
        </div>
        
        {results.results.length > 0 ? (
          <>
            {/* Genre Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium my-auto mr-2">Filter by:</span>
                {genres.slice(0, 10).map((genre) => (
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
            </div>
          
            <MovieGrid movies={results.results} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/movies/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Link>
                  </Button>
                )}
                
                <span className="px-4 py-2 text-sm">
                  Page {page.toLocaleString()} of {totalPages.toLocaleString()}
                </span>
                
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/movies/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse popular movies
            </p>
            <Button asChild>
              <Link href="/movies">
                Browse All Movies
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error searching movies:", error);
    notFound();
  }
}
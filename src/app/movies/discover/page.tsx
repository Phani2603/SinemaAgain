"use client";

import { useState, useEffect } from "react";
import { Movie, tmdbApi } from "@/lib/tmdb-api";
import MovieGrid from "@/components/movie-contents/MovieGrid";
import AdvancedFilters, { FilterState } from "@/components/movie-contents/AdvancedFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DiscoverMoviesPage() {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch filtered movies
  useEffect(() => {
    const fetchFilteredMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.discoverMovies({
          ...filters,
          page: currentPage
        });
        
        if (currentPage === 1) {
          setFilteredMovies(response.results);
        } else {
          // Append to existing movies for "load more" functionality
          setFilteredMovies(prev => [...prev, ...response.results]);
        }
        
        setTotalPages(response.total_pages);
      } catch (error) {
        console.error('Error fetching filtered movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [filters, currentPage]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/movies">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Discover Movies</h1>
          <p className="text-muted-foreground">
            Use advanced filters to find exactly what you&apos;re looking for
          </p>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters onFiltersChange={handleFiltersChange} className="mb-8" />

      {/* Results */}
      <div className="space-y-6">
        {loading && currentPage === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <MovieGrid 
              movies={filteredMovies} 
              title={`Results (${filteredMovies.length} movies${totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ''})`}
            />
            
            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center">
                <Button
                  onClick={loadMoreMovies}
                  disabled={loading}
                  size="lg"
                  variant="outline"
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </Button>
              </div>
            )}

            {filteredMovies.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No movies found with the current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
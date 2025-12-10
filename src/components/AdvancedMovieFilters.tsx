"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { REGIONS, LANGUAGES, GENRES } from "@/lib/constants";
import { SlidersHorizontal, X, Loader2, Search } from "lucide-react";
import MovieCard from "./movie-contents/MovieCard";
import { motion, AnimatePresence } from "motion/react";

interface AdvancedMovieFiltersProps {
  onApplyFilters?: (filters: FilterState) => void;
  initialRegion?: string;
  initialLanguage?: string;
  initialGenres?: number[];
}

export interface FilterState {
  region: string;
  language: string;
  genres: number[];
  sortBy: string;
}

export default function AdvancedMovieFilters({
  initialRegion = "IN",
  initialLanguage = "en",
  initialGenres = [],
}: AdvancedMovieFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    region: initialRegion,
    language: initialLanguage,
    genres: initialGenres,
    sortBy: "popularity.desc",
  });
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Filtered results based on search (only if searching locally)
  const filteredResults = searchQuery 
    ? results.filter((movie) =>
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : results;

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Prevent body scroll when popout is open
  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFilters]);

  const toggleGenre = (genreId: number) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter((id) => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const fetchFilteredResults = async (currentFilters: FilterState, page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        section: "filtered",
        region: currentFilters.region,
        language: currentFilters.language,
        genres: currentFilters.genres.join(","),
        sort_by: currentFilters.sortBy,
        page: page.toString(),
        _t: Date.now().toString(),
      });

      const response = await fetch(`/api/your-space?${params}`, { cache: "no-store" });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();

      // Derive totals robustly in case the API omits them
      const movies = Array.isArray(data.movies) ? data.movies : [];
      const totalResultsFromApi = Number(data.total_results) || movies.length;
      const totalPagesFromApi = Number(data.total_pages) || Math.ceil(totalResultsFromApi / 20);

      setResults(movies);
      setTotalResults(totalResultsFromApi);
      setTotalPages(Math.max(1, totalPagesFromApi));
    } catch (error) {
      console.error("Failed to fetch filtered results:", error);
      setError("Failed to load results. Please try again.");
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    setCurrentPage(1);
    fetchFilteredResults(filters, 1);
  };

  const handleReset = () => {
    const resetFilters = {
      region: initialRegion,
      language: initialLanguage,
      genres: [],
      sortBy: "none",
    };
    setFilters(resetFilters);
    setResults([]);
    setTotalResults(0);
    setTotalPages(0);
    setSearchQuery("");
    setCurrentPage(1);
    setError(null);
  };

  const handleClose = () => {
    setShowFilters(false);
    setResults([]);
    setTotalResults(0);
    setTotalPages(0);
    setSearchQuery("");
    setCurrentPage(1);
    setError(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (!searchQuery) {
      // Only fetch new data if not searching locally
      fetchFilteredResults(filters, page);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;
    const actualTotalPages = searchQuery 
      ? Math.ceil(filteredResults.length / 20) 
      : Math.max(1, totalPages);

    if (actualTotalPages <= maxVisible) {
      for (let i = 1; i <= actualTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(actualTotalPages);
      } else if (currentPage >= actualTotalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = actualTotalPages - 3; i <= actualTotalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(actualTotalPages);
      }
    }
    return pages;
  };

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Filters
        {filters.genres.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {filters.genres.length}
          </Badge>
        )}
      </Button>

      {/* Popout Overlay with Animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4"
            onClick={handleClose}
          >
            {/* Popout Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-7xl h-[95vh] md:h-[90vh] bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Left Panel - Filters */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card/50 p-3 md:p-4 overflow-y-auto max-h-[40vh] md:max-h-none">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Region Selector */}
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Region</label>
                    <Select
                    value={filters.region}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, region: value }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region.code} value={region.code}>
                          {region.flag} {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Selector */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Language</label>
                  <Select
                    value={filters.language}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="popularity.desc">Most Popular</SelectItem>
                      <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                      <SelectItem value="primary_release_date.desc">Latest Release</SelectItem>
                      <SelectItem value="primary_release_date.asc">Oldest Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Genre Selector */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block">
                    Genres {filters.genres.length > 0 && `(${filters.genres.length})`}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {GENRES.map((genre) => {
                      const isSelected = filters.genres.includes(genre.id);
                      return (
                        <Badge
                          key={genre.id}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80 transition-colors text-xs py-0.5"
                          onClick={() => toggleGenre(genre.id)}
                        >
                          {genre.icon} {genre.name}
                          {isSelected && <X className="ml-1 h-2.5 w-2.5" />}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleApply} className="flex-1 h-9" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Apply Filters"
                    )}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="h-9">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header with Search */}
              <div className="p-3 md:p-4 border-b border-border bg-card/30 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="font-semibold text-sm md:text-base">
                    {totalResults > 0 ? `${totalResults} Results` : "Select filters and click Apply"}
                  </h3>
                  {results.length > 0 && (
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search in results..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                      />
                    </div>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Found {filteredResults.length} of {results.length} movies
                  </p>
                )}
              </div>

              {/* Results List - Scrollable */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 min-h-0">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full text-destructive">
                    <div className="text-center">
                      <X className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">{error}</p>
                      <Button onClick={handleApply} variant="outline" className="mt-4">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                    {filteredResults.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No movies match &quot;{searchQuery}&quot;</p>
                      <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <SlidersHorizontal className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No results yet</p>
                      <p className="text-sm mt-1">Apply filters to see movies</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {((searchQuery && filteredResults.length > 20) || (!searchQuery && Math.max(1, totalPages) > 1)) && (
                <div className="p-3 md:p-4 border-t border-border bg-card/30 flex-shrink-0">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          size="default"
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === '...' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page as number)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                              size="icon"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(searchQuery ? Math.ceil(filteredResults.length / 20) : Math.max(1, totalPages), currentPage + 1))}
                          className={currentPage === (searchQuery ? Math.ceil(filteredResults.length / 20) : Math.max(1, totalPages)) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          size="default"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

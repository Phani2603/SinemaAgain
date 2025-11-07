"use client";

import { useState, useEffect } from "react";
import { tmdbApi } from "@/lib/tmdb-api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  genreId?: number;
  year?: number;
  minRating?: number;
  maxRating?: number;
  minRuntime?: number;
  maxRuntime?: number;
  sortBy?: string;
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'A-Z' },
  { value: 'title.desc', label: 'Z-A' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => CURRENT_YEAR - i);

export default function AdvancedFilters({ onFiltersChange, className }: AdvancedFiltersProps) {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'popularity.desc',
    genreId: undefined, // This will default to "all" in the UI
    year: undefined, // This will default to "any" in the UI
    minRating: 0,
    maxRating: 10,
    minRuntime: 0,
    maxRuntime: 300,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdbApi.getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof FilterState, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' || value === undefined || value === 'all' || value === 'any' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'popularity.desc',
      genreId: undefined,
      year: undefined,
      minRating: 0,
      maxRating: 10,
      minRuntime: 0,
      maxRuntime: 300,
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== 0 && value !== 10 && value !== 300 && value !== 'popularity.desc'
  ).length;

  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={activeFiltersCount === 0}
          >
            Clear All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Genre</label>
          <Select value={filters.genreId?.toString() || "all"} onValueChange={(value) => updateFilter('genreId', value === "all" ? undefined : parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="All genres..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Release Year</label>
          <Select value={filters.year?.toString() || "any"} onValueChange={(value) => updateFilter('year', value === "any" ? undefined : parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Any year..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any year</SelectItem>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isExpanded && (
          <>
            {/* Rating Range */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium">
                Rating: {filters.minRating} - {filters.maxRating}
              </label>
              <div className="px-2">
                <Slider
                  value={[filters.minRating || 0, filters.maxRating || 10]}
                  onValueChange={([min, max]) => {
                    updateFilter('minRating', min);
                    updateFilter('maxRating', max);
                  }}
                  max={10}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Runtime Range */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-sm font-medium">
                Runtime: {filters.minRuntime}min - {filters.maxRuntime}min
              </label>
              <div className="px-2">
                <Slider
                  value={[filters.minRuntime || 0, filters.maxRuntime || 300]}
                  onValueChange={([min, max]) => {
                    updateFilter('minRuntime', min);
                    updateFilter('maxRuntime', max);
                  }}
                  max={300}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Movie, tmdbApi } from "@/lib/tmdb-api";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeWindow = 'day' | 'week';

interface TrendingMoviesProps {
  className?: string;
}

export default function TrendingMovies({ className }: TrendingMoviesProps) {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('day');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.getTrendingMovies(timeWindow);
        setMovies(response.results.slice(0, 10)); // Show top 10 trending
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, [timeWindow]);

  return (
    <section className={cn("py-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trending Movies</h2>
        <div className="flex gap-2">
          <Button
            variant={timeWindow === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeWindow('day')}
          >
            Today
          </Button>
          <Button
            variant={timeWindow === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeWindow('week')}
          >
            This Week
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="relative">
              <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative">
              {/* Trending Number - Fixed positioning */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-20 shadow-lg border-2 border-white">
                {index + 1}
              </div>
              <MovieCard movie={movie} priority={index < 5} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
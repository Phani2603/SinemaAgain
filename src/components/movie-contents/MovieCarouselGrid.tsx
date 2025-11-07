"use client";

import { Movie } from "@/lib/tmdb-api";
import MovieCarousel from "./MovieCarousel";
import { cn } from "@/lib/utils";

interface MovieCarouselGridProps {
  movies: Movie[];
  title?: string;
  className?: string;
  showNumbers?: boolean;
}

export default function MovieCarouselGrid({ 
  movies, 
  title, 
  className, 
  showNumbers = false 
}: MovieCarouselGridProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      <MovieCarousel 
        movies={movies} 
        title={title}
        showNumbers={showNumbers}
      />
    </div>
  );
}
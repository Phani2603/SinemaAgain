"use client";

import { Movie } from "@/lib/tmdb-api";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  className?: string;
}

export default function MovieGrid({ movies, title, className }: MovieGridProps) {
  return (
    <section className={cn("py-6", className)}>
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            priority={index < 5} // Only prioritize loading for the first 5 movies
          />
        ))}
      </div>
    </section>
  );
}
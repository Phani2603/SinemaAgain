"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/lib/tmdb-api";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  className?: string;
  priority?: boolean;
}

export default function MovieCard({ 
  movie, 
  className,
  priority = false
}: MovieCardProps) {
  // Calculate poster URL with fallback
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : "/placeholder-poster.svg";
    
  // Get year from release date if available
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5",
        "border border-transparent hover:border-primary/20 hover:-translate-y-1",
        "transition-all duration-300 ease-out hover:shadow-lg",
        className
      )}
    >
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-md">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {releaseYear}
          </p>
          
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {movie.overview}
          </p>
        </div>
        
        {/* Hover action button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </div>
        </div>
      </Link>
    </div>
  );
}
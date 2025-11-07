"use client";

import { useState, useRef, useEffect } from "react";
import { Movie } from "@/lib/tmdb-api";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
  className?: string;
  showNumbers?: boolean;
}

export default function MovieCarousel({ 
  movies, 
  title, 
  className, 
  showNumbers = false 
}: MovieCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update button states
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px threshold
    }
  };

  useEffect(() => {
    checkScrollPosition();
  }, [movies]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320, // Scroll by approximately one card width
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320, // Scroll by approximately one card width
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={cn("py-6", className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="relative group">
        {/* Navigation Buttons - Show on hover for desktop */}
        <Button
          variant="outline"
          size="sm"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0 bg-background/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 p-0 bg-background/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
          onScroll={checkScrollPosition}
        >
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="relative flex-shrink-0 w-48 md:w-56"
            >
              {showNumbers && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-20 shadow-lg border-2 border-white">
                  {index + 1}
                </div>
              )}
              <MovieCard 
                movie={movie} 
                priority={index < 5} 
              />
            </div>
          ))}
        </div>

        {/* Scroll indicator for mobile */}
        <div className="lg:hidden mt-2 text-center text-xs text-muted-foreground">
          Swipe to see more →
        </div>
      </div>
    </section>
  );
}
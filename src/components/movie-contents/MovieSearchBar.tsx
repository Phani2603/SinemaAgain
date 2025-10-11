"use client";

import { useEffect, useState } from 'react';
import { MovieSearchCommand } from "@/components/movie-contents/MovieSearchCommandWrapper";
import { Search } from 'lucide-react';

export function MovieSearchBar() {
  const [isSearchHintVisible, setIsSearchHintVisible] = useState(true);

  // Hide the search hint after a user has interacted with the page
  useEffect(() => {
    const handleInteraction = () => {
      setIsSearchHintVisible(false);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <div className="flex flex-col items-start gap-1 max-w-md w-full">
      <div className="relative w-full group">
        <MovieSearchCommand />
        {isSearchHintVisible && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-1.5 rounded transition-opacity duration-300 opacity-70 group-hover:opacity-0">
            <Search className="w-3 h-3" />
            <span>Search movies</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 items-center text-xs text-muted-foreground">
        <span>Press</span>
        <div className="flex gap-1">
          <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">⌘</kbd>
          <kbd className="rounded border border-border bg-muted px-1.5 font-mono text-[10px]">K</kbd>
        </div>
        <span>to search</span>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X as XIcon } from "lucide-react";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({ className, autoFocus = false }: SearchBarProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/movies/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form 
        onSubmit={handleSubmit} 
        className={`relative flex w-full transition-all duration-300 bg-white/5 backdrop-blur-md rounded-full border ${isFocused ? 'border-primary shadow-sm shadow-primary/20' : 'border-border'}`}
      >
        <div className="flex-grow relative flex items-center">
          <SearchIcon className="h-4 w-4 absolute left-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for movies, actors, directors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="border-0 bg-transparent rounded-l-full pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button 
          type="submit"
          variant="default"
          size="sm"
          className="m-1 rounded-full px-4"
        >
          <SearchIcon className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
}
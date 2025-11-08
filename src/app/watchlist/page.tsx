"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Star, 
  Calendar, 
  Clock,
  Trash2,
  Info,
  Filter,
  Search,
  Plus,
  Grid3X3,
  List,
  Film
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  status?: string;
}

interface WatchlistItem extends Movie {
  added_at: string;
  priority: "low" | "medium" | "high";
  notes?: string;
}

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const { refreshWatchlist } = useWatchlist();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating" | "release">("added");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState<"all" | "high" | "medium" | "low">("all");

  // Memoize fetchWatchlist to prevent dependency changes
  const fetchWatchlist = useCallback(async () => {
    if (!session?.user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching watchlist from /api/watchlist...');
      const response = await fetch('/api/watchlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received watchlist data:', data);
        setWatchlist(data.movies || []);
      } else {
        console.error('API failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  // Initial data load only
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  // Listen for real-time updates from context
  useEffect(() => {
    const handleWatchlistUpdate = () => {
      console.log('Watchlist updated event received, refreshing...');
      fetchWatchlist();
      refreshWatchlist(); // Also refresh the context
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [fetchWatchlist, refreshWatchlist]);

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(current => current.filter(item => item.id !== movieId));
  };

  const updatePriority = (movieId: number, priority: "low" | "medium" | "high") => {
    setWatchlist(current =>
      current.map(item =>
        item.id === movieId ? { ...item, priority } : item
      )
    );
  };

  // Filter and sort watchlist
  const filteredAndSortedWatchlist = watchlist
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === "all" || item.priority === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.vote_average - a.vote_average;
        case "release":
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case "added":
        default:
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime();
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your Watchlist</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view your watchlist.</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" />
              My Watchlist
            </h1>
            <p className="text-muted-foreground mt-1">
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
            </p>
          </div>
          
          <Button asChild>
            <Link href="/movies">
              <Plus className="w-4 h-4 mr-2" />
              Add Movies
            </Link>
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search your watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterBy("all")}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("high")}>
                  High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("medium")}>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("low")}>
                  Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort: {sortBy === "added" ? "Recently Added" : sortBy === "title" ? "Title" : sortBy === "rating" ? "Rating" : "Release Date"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("added")}>
                  Recently Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Rating
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("release")}>
                  Release Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Watchlist Content */}
        {filteredAndSortedWatchlist.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No movies found" : "Your watchlist is empty"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search terms." : "Start adding movies to keep track of what you want to watch!"}
              </p>
              <Button asChild>
                <Link href="/movies">Browse Movies</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredAndSortedWatchlist.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={viewMode === "grid" ? "" : "w-full"}
                >
                  <Card className={`group hover:shadow-lg transition-all duration-200 ${viewMode === "list" ? "p-0" : ""}`}>
                    <div className={viewMode === "list" ? "flex p-4" : ""}>
                      <div className={`relative ${viewMode === "list" ? "w-24 h-36 flex-shrink-0" : "w-full h-64"}`}>
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <Film className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Priority</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updatePriority(movie.id, "high")}>
                                High Priority
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePriority(movie.id, "medium")}>
                                Medium Priority
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePriority(movie.id, "low")}>
                                Low Priority
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => removeFromWatchlist(movie.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className={`${viewMode === "list" ? "ml-4 flex-1" : "p-4"}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                            {movie.title}
                          </h3>
                          <Badge variant={getPriorityColor(movie.priority) as "default" | "destructive" | "outline" | "secondary"} className="text-xs">
                            {movie.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          </div>
                          {movie.runtime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{movie.runtime}m</span>
                            </div>
                          )}
                        </div>
                        
                        {viewMode === "list" && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {movie.overview}
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link href={`/movies/${movie.id}`}>
                              <Info className="w-3 h-3 mr-1" />
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
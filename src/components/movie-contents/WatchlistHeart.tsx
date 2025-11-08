"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface WatchlistHeartProps {
  movieId: number;
  className?: string;
}

export default function WatchlistHeart({ 
  movieId,
  className = ""
}: WatchlistHeartProps) {
  const { status } = useSession();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, isLoading: contextLoading } = useWatchlist();
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicked
    e.stopPropagation();

    // Don't do anything if not authenticated
    if (status !== "authenticated") {
      return;
    }

    setIsOperationLoading(true);
    
    try {
      const isCurrentlyInWatchlist = isInWatchlist(movieId);
      
      if (isCurrentlyInWatchlist) {
        await removeFromWatchlist(movieId);
      } else {
        await addToWatchlist(movieId);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    } finally {
      setIsOperationLoading(false);
    }
  };

  // Don't show anything if not authenticated or context is loading
  if (status !== "authenticated" || contextLoading) {
    return null;
  }

  const isCurrentlyInWatchlist = isInWatchlist(movieId);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleWatchlistToggle}
      disabled={isOperationLoading}
      className={`absolute top-2 left-2 z-10 p-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-none transition-all ${className}`}
    >
      {isOperationLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Heart 
          className={`h-3 w-3 ${isCurrentlyInWatchlist ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-400'}`}
        />
      )}
    </Button>
  );
}
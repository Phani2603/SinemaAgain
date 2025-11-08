"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWatchlist } from "@/contexts/WatchlistContext";

interface WatchlistButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export default function WatchlistButton({ 
  movieId, 
  movieTitle,
  className = ""
}: WatchlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, isLoading: contextLoading } = useWatchlist();
  const [isOperationLoading, setIsOperationLoading] = useState(false);

  const handleWatchlistToggle = async () => {
    // Redirect to sign in if not authenticated
    if (status !== "authenticated" || !session?.user) {
      router.push("/auth/signin");
      return;
    }

    setIsOperationLoading(true);
    
    try {
      const isCurrentlyInWatchlist = isInWatchlist(movieId);
      let success = false;
      
      if (isCurrentlyInWatchlist) {
        success = await removeFromWatchlist(movieId);
        if (success) {
          console.log(`Removed "${movieTitle}" from watchlist`);
        }
      } else {
        success = await addToWatchlist(movieId);
        if (success) {
          console.log(`Added "${movieTitle}" to watchlist`);
        }
      }
      
      if (!success) {
        console.error('Watchlist operation failed');
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    } finally {
      setIsOperationLoading(false);
    }
  };

  // Show loading state during context initialization
  if (contextLoading) {
    return (
      <Button 
        variant="outline" 
        disabled
        className={`gap-2 ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  const isCurrentlyInWatchlist = isInWatchlist(movieId);

  // Main button states
  if (isCurrentlyInWatchlist) {
    return (
      <Button 
        onClick={handleWatchlistToggle}
        disabled={isOperationLoading}
        variant="default"
        className={`gap-2 bg-red-600 hover:bg-red-700 text-white ${className}`}
      >
        {isOperationLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Removing...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            In Watchlist
          </>
        )}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleWatchlistToggle}
      disabled={isOperationLoading}
      variant="outline"
      className={`gap-2 hover:bg-primary hover:text-primary-foreground ${className}`}
    >
      {isOperationLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface WatchlistContextType {
  watchlistIds: Set<number>;
  isLoading: boolean;
  error: string | null;
  addToWatchlist: (movieId: number) => Promise<boolean>;
  removeFromWatchlist: (movieId: number) => Promise<boolean>;
  isInWatchlist: (movieId: number) => boolean;
  refreshWatchlist: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}

interface WatchlistProviderProps {
  children: React.ReactNode;
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const { data: session, status } = useSession();
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial watchlist data (just IDs, not full movie details)
  const fetchWatchlistIds = useCallback(async () => {
    if (status !== "authenticated" || !session?.user) {
      setWatchlistIds(new Set());
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/watchlist/ids', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWatchlistIds(new Set(data.watchlistIds || []));
      } else {
        throw new Error('Failed to fetch watchlist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch watchlist IDs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  // Load watchlist on auth state change
  useEffect(() => {
    fetchWatchlistIds();
  }, [fetchWatchlistIds]);

  const addToWatchlist = useCallback(async (movieId: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        // Update local state optimistically
        setWatchlistIds(prev => new Set([...prev, movieId]));
        
        // Clear any previous errors
        setError(null);
        
        // Dispatch event for other components that might need to know
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { movieId, action: 'added' } 
        }));
        
        return true;
      } else {
        // Only throw error if response is not ok
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to add to watchlist`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to watchlist';
      setError(errorMessage);
      console.error('Add to watchlist error:', err);
      return false;
    }
  }, []);

  const removeFromWatchlist = useCallback(async (movieId: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        // Update local state optimistically
        setWatchlistIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(movieId);
          return newSet;
        });
        
        // Clear any previous errors
        setError(null);
        
        // Dispatch event for other components that might need to know
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
          detail: { movieId, action: 'removed' } 
        }));
        
        return true;
      } else {
        // Only throw error if response is not ok
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to remove from watchlist`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from watchlist';
      setError(errorMessage);
      console.error('Remove from watchlist error:', err);
      return false;
    }
  }, []);

  const isInWatchlist = useCallback((movieId: number): boolean => {
    return watchlistIds.has(movieId);
  }, [watchlistIds]);

  const refreshWatchlist = useCallback(async () => {
    await fetchWatchlistIds();
  }, [fetchWatchlistIds]);

  const value: WatchlistContextType = {
    watchlistIds,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
"use client";

import React, { useState } from 'react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useSession } from 'next-auth/react';

export default function WatchlistTest() {
  const { data: session } = useSession();
  const { watchlistIds, isLoading, error, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [testMovieId, setTestMovieId] = useState<number>(1218925); // Movie that exists in database
  const [actionStatus, setActionStatus] = useState<string>('');

  const handleAddToWatchlist = async () => {
    setActionStatus('Adding...');
    const success = await addToWatchlist(testMovieId);
    setActionStatus(success ? 'Added successfully!' : 'Failed to add');
    setTimeout(() => setActionStatus(''), 3000);
  };

  const handleRemoveFromWatchlist = async () => {
    setActionStatus('Removing...');
    const success = await removeFromWatchlist(testMovieId);
    setActionStatus(success ? 'Removed successfully!' : 'Failed to remove');
    setTimeout(() => setActionStatus(''), 3000);
  };

  if (!session) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Please sign in to test watchlist functionality</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Watchlist Debug Panel</h2>
      
      <div className="space-y-2">
        <p><strong>User:</strong> {session.user?.name} ({session.user?.email})</p>
        <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Watchlist IDs:</strong> [{Array.from(watchlistIds).join(', ')}]</p>
        <p><strong>Total Movies:</strong> {watchlistIds.size}</p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
          <input 
            type="number" 
            value={testMovieId} 
            onChange={(e) => setTestMovieId(parseInt(e.target.value) || 0)}
            className="px-3 py-1 border rounded text-black"
            placeholder="Movie ID"
          />
          <span className={`px-2 py-1 rounded text-sm ${isInWatchlist(testMovieId) ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
            {isInWatchlist(testMovieId) ? 'In Watchlist' : 'Not in Watchlist'}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleAddToWatchlist}
            disabled={isLoading || isInWatchlist(testMovieId)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Add to Watchlist
          </button>
          <button 
            onClick={handleRemoveFromWatchlist}
            disabled={isLoading || !isInWatchlist(testMovieId)}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
          >
            Remove from Watchlist
          </button>
        </div>

        {actionStatus && (
          <p className={`text-sm font-medium ${actionStatus.includes('success') ? 'text-green-600' : actionStatus.includes('Failed') ? 'text-red-600' : 'text-blue-600'}`}>
            {actionStatus}
          </p>
        )}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>Test with movie ID 1218925 (confirmed in database)</p>
        <p>Check browser console for detailed error messages</p>
      </div>
    </div>
  );
}
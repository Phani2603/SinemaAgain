"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Friend {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface RecommendMovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: number;
  movieTitle: string;
}

export default function RecommendMovieDialog({
  open,
  onOpenChange,
  movieId,
  movieTitle,
}: RecommendMovieDialogProps) {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFriends, setFetchingFriends] = useState(false);

  useEffect(() => {
    if (open && session?.user) {
      fetchFriends();
      setSelectedFriends([]); // Reset selection when opening
    } else if (!open) {
      setSelectedFriends([]); // Reset selection when closing
    }
  }, [open, session]);

  const fetchFriends = async () => {
    try {
      setFetchingFriends(true);
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setFetchingFriends(false);
    }
  };

  const handleToggleFriend = (friendId: string, checked: boolean) => {
    if (checked && selectedFriends.length >= 5) {
      toast.error('You can only select up to 5 friends at a time');
      return;
    }
    
    setSelectedFriends((prev) =>
      checked
        ? [...prev, friendId]
        : prev.filter((id) => id !== friendId)
    );
  };

  const handleSend = async () => {
    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friendIds: selectedFriends,
          movieId,
          movieTitle,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Movie recommended successfully!');
        setSelectedFriends([]);
        onOpenChange(false);
      } else {
        toast.error(data.error || 'Failed to send recommendation');
      }
    } catch (error) {
      console.error('Failed to send recommendation:', error);
      toast.error('Failed to send recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Recommend Movie
          </DialogTitle>
          <DialogDescription>
            Recommend &ldquo;{movieTitle}&rdquo; to your friends
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Friends List */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Friends</label>
            {fetchingFriends ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No friends yet</p>
              </div>
            ) : (
              <div className="max-h-[240px] overflow-y-auto border rounded-lg p-2 space-y-1">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friend._id)}
                      onCheckedChange={(checked) => handleToggleFriend(friend._id, checked as boolean)}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.image} alt={friend.name} />
                      <AvatarFallback className="text-xs">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {friend.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Select up to 5 friends ({selectedFriends.length}/5)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading || selectedFriends.length === 0}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

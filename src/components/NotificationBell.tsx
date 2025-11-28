"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import NotificationPanel from "./NotificationPanel";

interface FriendRequest {
  id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
}

interface Notification {
  id: string;
  type: "friend_request" | "friend_accepted";
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: string;
  read: boolean;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        const requests: FriendRequest[] = data.received || [];
        
        // Convert to notifications
        const notifs: Notification[] = requests.map((req) => ({
          id: req.id,
          type: "friend_request" as const,
          user: req.user,
          createdAt: req.createdAt,
          read: false,
        }));
        
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const acceptFriendRequest = async (friendshipId: string, userName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/friends/request/${friendshipId}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(`You're now friends with ${userName}!`, {
          icon: <Users className="w-4 h-4" />,
        });
        
        // Remove from notifications
        setNotifications(prev => prev.filter(n => n.id !== friendshipId));
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Refresh friend list
        await fetchNotifications();
      } else {
        const error = await response.json();
        toast.error('Failed to accept', {
          description: error.error || 'Could not accept friend request.',
        });
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast.error('Network error', {
        description: 'Failed to accept friend request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/friends/request/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.info('Friend request declined');
        
        // Remove from notifications
        setNotifications(prev => prev.filter(n => n.id !== friendshipId));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Failed to decline request');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full bg-background/80 backdrop-blur-md border-border/50 hover:bg-background/90 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white border-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onAccept={acceptFriendRequest}
        onReject={rejectFriendRequest}
        loading={loading}
      />
    </>
  );
}

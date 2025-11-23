"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  UserMinus,
  Search,
  Film,
  Heart,
  Check,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string;
  friendshipId?: string;
  friendsSince?: string;
  stats: {
    moviesWatched: number;
    commonMovies: number;
    mutualFriends: number;
  };
}

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

interface SearchResult {
  id: string;
  name: string;
  email: string;
  image?: string;
  stats: {
    friendsCount: number;
    watchlistCount: number;
  };
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch friends data
  useEffect(() => {
    if (session?.user) {
      fetchFriends();
      fetchRequests();
    }
  }, [session]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.received || []);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId }),
      });

      if (response.ok) {
        toast.success('Friend request sent!', {
          description: 'Your friend request has been sent successfully.',
        });
        setSearchDialogOpen(false);
        setUserSearchQuery('');
        setSearchResults([]);
      } else {
        const error = await response.json();
        toast.error('Failed to send request', {
          description: error.error || 'Could not send friend request. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
      toast.error('Network error', {
        description: 'Failed to send friend request. Check your connection.',
      });
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${friendshipId}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Friend request accepted!', {
          description: 'You are now friends. Start sharing movie recommendations!',
        });
        await fetchFriends();
        await fetchRequests();
      } else {
        const error = await response.json();
        toast.error('Failed to accept', {
          description: error.error || 'Could not accept friend request.',
        });
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${friendshipId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.info('Friend request declined', {
          description: 'The friend request has been removed.',
        });
        await fetchRequests();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Failed to decline', {
        description: 'Could not decline the friend request.',
      });
    }
  };

  const removeFriend = async (friendshipId: string, friendName: string) => {
    toast.warning(`Remove ${friendName}?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Remove',
        onClick: async () => {
          try {
            const response = await fetch('/api/friends', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ friendshipId }),
            });

            if (response.ok) {
              toast.success('Friend removed', {
                description: `${friendName} has been removed from your friends.`,
              });
              await fetchFriends();
            } else {
              const error = await response.json();
              toast.error('Failed to remove', {
                description: error.error || 'Could not remove friend.',
              });
            }
          } catch (error) {
            console.error('Failed to remove friend:', error);
            toast.error('Network error', {
              description: 'Failed to remove friend. Check your connection.',
            });
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading") {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect with Friends</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view and manage your friends.</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/movies" className="hover:text-foreground transition-colors">
            Movies
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Friends</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.history.back()}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" />
                Friends
              </h1>
              <p className="text-muted-foreground mt-1">
                {friends.length} {friends.length === 1 ? "friend" : "friends"} connected
              </p>
            </div>
          </div>
          
          {/* Search Dialog */}
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Find Friends</DialogTitle>
                <DialogDescription>
                  Search for users by name or email to send friend requests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    className="pl-10"
                  />
                </div>

                {searchLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && userSearchQuery.length >= 2 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                )}

                {!searchLoading && searchResults.length > 0 && (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {searchResults.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.stats.friendsCount} friends • {user.stats.watchlistCount} movies
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => sendFriendRequest(user.id)}
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search within friends */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">\n          <TabsList>
            <TabsTrigger value="all">All Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="requests">
              Friend Requests ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : filteredFriends.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchQuery ? "No friends found" : "No friends yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery ? "Try adjusting your search terms." : "Start connecting with other movie enthusiasts!"}
                  </p>
                  <Button onClick={() => setSearchDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    <Card className="group hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={friend.image} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{friend.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {friend.email}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              Movies watched
                            </span>
                            <span className="font-medium">{friend.stats.moviesWatched}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Movies in common
                            </span>
                            <span className="font-medium text-primary">{friend.stats.commonMovies}</span>
                          </div>
                          
                          {friend.friendsSince && (
                            <div className="text-xs text-muted-foreground">
                              Friends since {new Date(friend.friendsSince).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex-1"
                            onClick={() => friend.friendshipId && removeFriend(friend.friendshipId, friend.name)}
                          >
                            <UserMinus className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No pending friend requests</h3>
                  <p className="text-muted-foreground">
                    When you receive friend requests, they&apos;ll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.user.image} alt={request.user.name} />
                            <AvatarFallback>
                              {request.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{request.user.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptFriendRequest(request.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectFriendRequest(request.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
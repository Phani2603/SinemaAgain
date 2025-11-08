"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  UserX,
  Search,
  Film,
  Heart
} from "lucide-react";
import Link from "next/link";

interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string;
  mutualFriends: number;
  moviesWatched: number;
  commonMovies: number;
  status: "online" | "offline";
}

export default function FriendsPage() {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // Mock friends data
      const mockFriends: Friend[] = [
        {
          id: "1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
          mutualFriends: 5,
          moviesWatched: 156,
          commonMovies: 23,
          status: "online"
        },
        {
          id: "2",
          name: "Alex Chen",
          email: "alex@example.com",
          mutualFriends: 3,
          moviesWatched: 89,
          commonMovies: 15,
          status: "offline"
        },
        {
          id: "3",
          name: "Maria Garcia",
          email: "maria@example.com",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
          mutualFriends: 8,
          moviesWatched: 234,
          commonMovies: 45,
          status: "online"
        }
      ];
      
      setTimeout(() => {
        setFriends(mockFriends);
        setLoading(false);
      }, 1000);
    }
  }, [session]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Friends
            </h1>
            <p className="text-muted-foreground mt-1">
              {friends.length} {friends.length === 1 ? "friend" : "friends"} connected
            </p>
          </div>
          
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>

        {/* Search */}
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
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="online">
              Online ({friends.filter(f => f.status === "online").length})
            </TabsTrigger>
            <TabsTrigger value="requests">Friend Requests (0)</TabsTrigger>
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
                  <Button>
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
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={friend.image} alt={friend.name} />
                              <AvatarFallback>
                                {friend.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                              friend.status === "online" ? "bg-green-500" : "bg-gray-400"
                            }`} />
                          </div>
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
                            <span className="font-medium">{friend.moviesWatched}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Movies in common
                            </span>
                            <span className="font-medium text-primary">{friend.commonMovies}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Mutual friends
                            </span>
                            <span className="font-medium">{friend.mutualFriends}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <UserX className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="online" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends
                .filter(friend => friend.status === "online")
                .map((friend) => (
                  <Card key={friend.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={friend.image} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-green-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{friend.name}</h3>
                          <p className="text-sm text-green-600">Online now</p>
                        </div>
                        <Button size="sm">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <UserPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No pending friend requests</h3>
                <p className="text-muted-foreground">
                  When you receive friend requests, they&apos;ll appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
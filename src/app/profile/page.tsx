"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Star, LucideVideotape, Users, Heart, Award, Globe, Languages } from "lucide-react";
import  {motion}  from "motion/react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import PreferencesEditor from "@/components/PreferencesEditor";
import { useSearchParams } from "next/navigation";
import { REGIONS, GENRES } from "@/lib/constants";

interface UserStats {
  moviesWatched: number;
  averageRating: number;
  favoriteGenres: string[];
  friendsCount: number;
  watchlistCount: number;
  joinDate: string;
}

interface UserPreferences {
  region?: string;
  languages?: Array<{
    code: string;
    name: string;
    isPrimary: boolean;
  }>;
  favoriteGenres?: number[];
}

function ProfileContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(true);
  const [showPreferencesEditor, setShowPreferencesEditor] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // Auto-open preferences editor if query param present
      const shouldOpen = searchParams.get("openPreferences") === "true";
      if (shouldOpen) {
        setShowPreferencesEditor(true);
      }
      // Fetch real user stats from database
      const fetchUserStats = async () => {
        try {
          const response = await fetch('/api/profile');
          if (response.ok) {
            const data = await response.json();
            setUserStats({
              moviesWatched: data.moviesWatched,
              averageRating: data.averageRating,
              favoriteGenres: data.favoriteGenres,
              friendsCount: data.friendsCount,
              watchlistCount: data.watchlistCount,
              joinDate: data.joinDate
            });
          } else {
            console.error('Failed to fetch profile data:', response.status);
            // Fallback to mock data if API fails
            setUserStats({
              moviesWatched: 0,
              averageRating: 0,
              favoriteGenres: ["Action", "Sci-Fi", "Drama"],
              friendsCount: 0,
              watchlistCount: 0,
              joinDate: "Recently"
            });
          }
        } catch (error) {
          console.error('Profile fetch error:', error);
          // Fallback to mock data if API fails
          setUserStats({
            moviesWatched: 0,
            averageRating: 0,
            favoriteGenres: ["Action", "Sci-Fi", "Drama"],
            friendsCount: 0,
            watchlistCount: 0,
            joinDate: "Recently"
          });
        }
      };

      // Fetch user preferences
      const fetchUserPreferences = async () => {
        try {
          const response = await fetch('/api/preferences');
          if (response.ok) {
            const data = await response.json();
            setUserPreferences(data);
          }
        } catch (error) {
          console.error('Preferences fetch error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserStats();
      fetchUserPreferences();

      // Listen for watchlist updates to refresh stats
      const handleWatchlistUpdate = () => {
        fetchUserStats();
      };

      window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
      return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    } else {
      setLoading(false);
    }
  }, [session, searchParams]);

  if (status === "loading") {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
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
            <p>Please sign in to view your profile.</p>
            <Button asChild className="mt-4">
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
        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={session.user.image || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold lg:text-4xl font-exo2 text-card-foreground">
                  {session.user.name || "Movie Enthusiast"}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-lg">{session.user.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg">Joined {loading ? "..." : userStats?.joinDate}</span>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Badge variant="secondary">Movie Buff</Badge>
                  <Badge variant="outline">Verified User</Badge>
                  {!loading && userStats && userStats.moviesWatched > 100 && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                      Century Club
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button asChild variant="outline">
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <LucideVideotape className="w-10 h-10 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : userStats?.moviesWatched}
                </div>
                <p className="text-sm text-muted-foreground">Movies Watched</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-10 h-10 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : userStats?.averageRating}
                </div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-10 h-10 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : userStats?.watchlistCount}
                </div>
                <p className="text-sm text-muted-foreground">Watchlist</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-10 h-10 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12 mx-auto" /> : userStats?.friendsCount}
                </div>
                <p className="text-sm text-muted-foreground">Friends</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Favorite Genres & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <p className="font-telex text-xl">Your Preferences</p>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferencesEditor(!showPreferencesEditor)}
                  >
                    {showPreferencesEditor ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showPreferencesEditor ? (
                  <PreferencesEditor
                    initialRegion={userPreferences.region}
                    initialLanguages={userPreferences.languages}
                    initialGenres={userPreferences.favoriteGenres}
                    onSave={() => {
                      setShowPreferencesEditor(false);
                      // Refetch preferences
                      fetch('/api/preferences')
                        .then(res => res.json())
                        .then(setUserPreferences);
                    }}
                  />
                ) : loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Region */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Region</span>
                      </div>
                      <Badge variant="secondary">
                        {REGIONS.find(r => r.code === userPreferences.region)?.flag}{' '}
                        {REGIONS.find(r => r.code === userPreferences.region)?.name || 'Not set'}
                      </Badge>
                    </div>

                    {/* Languages */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Languages className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Languages</span>
                      </div>
                      {userPreferences.languages && userPreferences.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.languages.map(lang => (
                            <Badge
                              key={lang.code}
                              variant={lang.isPrimary ? "default" : "outline"}
                            >
                              {lang.name}
                              {lang.isPrimary && ' ⭐'}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No languages selected</p>
                      )}
                    </div>

                    {/* Favorite Genres */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Favorite Genres</span>
                      </div>
                      {userPreferences.favoriteGenres && userPreferences.favoriteGenres.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userPreferences.favoriteGenres.map(genreId => {
                            const genre = GENRES.find(g => g.id === genreId);
                            return (
                              <Badge key={genreId} variant="secondary">
                                {genre?.icon} {genre?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No genres selected</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LucideVideotape className="w-7 h-7" />
                  <p className="text-lg md:text-lg lg:text-2xl font-telex">Quick Actions</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 font-telex md:text-lg lg:text-2xl ">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/watchlist">
                    <Heart className="w-4 h-4 mr-2" />
                    View Watchlist
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/friends">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Friends
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/movies">
                    <LucideVideotape className="w-4 h-4 mr-2" />
                    Browse Movies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
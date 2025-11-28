"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Handshake, 
  Users,
  Star,
  Loader2,
  LucideVideotape,
  ArrowLeft,
  Grid3X3,
  List,
  MoreVertical,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FriendRecommendation {
  movieId: number;
  recommendations: Array<{
    from: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    };
    message?: string;
    status: string;
    createdAt: Date;
  }>;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface RecommendationWithMovie extends FriendRecommendation {
  movieDetails?: MovieDetails;
}

const ITEMS_PER_PAGE = 12;

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationWithMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFriend, setSelectedFriend] = useState<string>("all");

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchRecommendations();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/received');
      
      if (response.ok) {
        const data = await response.json();
        const recs: FriendRecommendation[] = data.recommendations || [];
        
        const recsWithMovies = await Promise.all(
          recs.map(async (rec) => {
            try {
              const movieRes = await fetch(`/api/movie-details/${rec.movieId}`);
              if (movieRes.ok) {
                const movieDetails = await movieRes.json();
                return { ...rec, movieDetails } as RecommendationWithMovie;
              }
            } catch (error) {
              console.error(`Failed to fetch movie ${rec.movieId}:`, error);
            }
            return null;
          })
        );
        
        setRecommendations(recsWithMovies.filter((r): r is RecommendationWithMovie => r !== null && !!r.movieDetails));
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(recommendations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // Get unique friends who recommended movies
  const uniqueFriends = recommendations.reduce((acc, rec) => {
    rec.recommendations.forEach(r => {
      if (!acc.find(f => f._id === r.from._id)) {
        acc.push(r.from);
      }
    });
    return acc;
  }, [] as Array<{ _id: string; name: string; email: string; image?: string }>);

  // Filter recommendations by selected friend
  const filteredRecommendations = selectedFriend === "all"
    ? recommendations
    : recommendations.filter(rec => 
        rec.recommendations.some(r => r.from._id === selectedFriend)
      );

  const paginatedRecommendations = viewMode === "list" 
    ? filteredRecommendations.slice(startIndex, endIndex)
    : filteredRecommendations;

  if (status === "loading" || loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Handshake className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Get Personalized Recommendations</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to receive movie recommendations based on your friends&apos; preferences
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/movies" className="hover:text-foreground transition-colors">Movies</Link>
        <span>/</span>
        <Link href="/friends" className="hover:text-foreground transition-colors">Friends</Link>
        <span>/</span>
        <span className="text-foreground font-medium">For You</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Handshake className="w-8 h-8 text-primary" />
              For You
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredRecommendations.length} movie{filteredRecommendations.length !== 1 ? 's' : ''} recommended by friends
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Friend Filter */}
          {recommendations.length > 0 && uniqueFriends.length > 0 && (
            <Select value={selectedFriend} onValueChange={(value) => { setSelectedFriend(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All friends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Friends</SelectItem>
                {uniqueFriends.map((friend) => (
                  <SelectItem key={friend._id} value={friend._id}>
                    {friend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* View Mode Toggle */}
          {recommendations.length > 0 && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => { setViewMode("grid"); setCurrentPage(1); }}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => { setViewMode("list"); setCurrentPage(1); }}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          )}
        </div>
      </div>

      {filteredRecommendations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <LucideVideotape className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {selectedFriend === "all" ? "No Recommendations Yet" : "No Recommendations from this Friend"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {selectedFriend === "all" 
                ? "Add friends and build your watchlist to get personalized recommendations"
                : "This friend hasn't recommended any movies to you yet"
              }
            </p>
            <div className="flex gap-3 justify-center">
              {selectedFriend !== "all" && (
                <Button onClick={() => setSelectedFriend("all")} variant="outline">
                  Show All Recommendations
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/friends"><Users className="w-4 h-4 mr-2" />Find Friends</Link>
              </Button>
              <Button asChild>
                <Link href="/movies"><LucideVideotape className="w-4 h-4 mr-2" />Browse Movies</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {paginatedRecommendations.map((rec) => {
            const movie = rec.movieDetails!;
            return (
              <div key={rec.movieId} className="group">
                <Link href={`/movies/${rec.movieId}`}>
                  <Card className="overflow-hidden border-0 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[2/3] bg-muted">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <LucideVideotape className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 left-2 bg-black/70 text-white border-0 text-xs">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                      <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-7 w-7 p-0 rounded-full bg-black/70 hover:bg-black/90 border-0">
                              <MoreVertical className="h-4 w-4 text-white" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-3" align="end">
                            <div className="space-y-2">
                              <p className="text-sm font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Recommended by ({rec.recommendations.length})
                              </p>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {rec.recommendations.map((r, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                                    <Avatar className="w-7 h-7">
                                      <AvatarImage src={r.from.image} alt={r.from.name} />
                                      <AvatarFallback className="text-xs">{r.from.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{r.from.name}</p>
                                      <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </Card>
                </Link>
                <h3 className="mt-2 text-sm font-medium line-clamp-2 px-1">{movie.title}</h3>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedRecommendations.map((rec) => {
              const movie = rec.movieDetails!;
              return (
                <Card key={rec.movieId} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <Link href={`/movies/${rec.movieId}`} className="flex-shrink-0">
                        <div className="relative w-24 h-36 rounded-md overflow-hidden bg-muted">
                          {movie.poster_path ? (
                            <Image src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <LucideVideotape className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <Link href={`/movies/${rec.movieId}`}>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">{movie.title}</h3>
                            </Link>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{movie.vote_average.toFixed(1)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(movie.release_date).getFullYear()}</span>
                              </div>
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3" align="end">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold flex items-center gap-2">
                                  <Users className="w-4 h-4 text-primary" />
                                  Recommended by ({rec.recommendations.length})
                                </p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {rec.recommendations.map((r, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                                      <Avatar className="w-7 h-7">
                                        <AvatarImage src={r.from.image} alt={r.from.name} />
                                        <AvatarFallback className="text-xs">{r.from.name.charAt(0).toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{r.from.name}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{movie.overview}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {rec.recommendations.length} friend{rec.recommendations.length !== 1 ? 's' : ''}
                          </Badge>
                          <div className="flex -space-x-2">
                            {rec.recommendations.slice(0, 3).map((r, idx) => (
                              <Avatar key={idx} className="w-6 h-6 border-2 border-background">
                                <AvatarImage src={r.from.image} alt={r.from.name} />
                                <AvatarFallback className="text-xs">{r.from.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-9">
                    {page}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

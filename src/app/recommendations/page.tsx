"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Users,
  Star,
  Loader2,
  Film,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Recommendation {
  movieId: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  score: number;
  recommendedBy?: Array<{
    userId: string;
    name: string;
    similarity: number;
  }>;
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchRecommendations();
    }
  }, [session]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
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
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/movies" className="hover:text-foreground transition-colors">
          Movies
        </Link>
        <span>/</span>
        <Link href="/friends" className="hover:text-foreground transition-colors">
          Friends
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">For You</span>
      </div>

      {/* Simple Header */}
      <div className="flex items-center justify-between">
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
              <Sparkles className="w-8 h-8 text-primary" />
              For You
            </h1>
            <p className="text-muted-foreground mt-1">
              Movies your friends recommend
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add friends and build your watchlist to get personalized recommendations
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline">
                <Link href="/friends">
                  <Users className="w-4 h-4 mr-2" />
                  Find Friends
                </Link>
              </Button>
              <Button asChild>
                <Link href="/movies">
                  <Film className="w-4 h-4 mr-2" />
                  Browse Movies
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendations.map((movie) => (
            <Link key={movie.movieId} href={`/movies/${movie.movieId}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full border-0">
                <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Film className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Top badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <Badge className="bg-black/70 text-white border-0 text-xs">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </Badge>
                    {movie.score > 0 && (
                      <Badge className="bg-primary/90 text-white border-0 text-xs">
                        {Math.round(movie.score * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Bottom info overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {movie.title}
                    </h3>
                    {movie.recommendedBy && movie.recommendedBy.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <Users className="w-3 h-3" />
                        <span className="line-clamp-1">
                          {movie.recommendedBy.slice(0, 2).map((f, idx, arr) => (
                            <span key={`${movie.movieId}-${f.userId}`}>
                              {f.name}
                              {idx < arr.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                          {movie.recommendedBy.length > 2 && ` +${movie.recommendedBy.length - 2}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

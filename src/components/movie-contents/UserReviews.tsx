"use client";

import { useState, useEffect } from "react";
import { tmdbApi } from "@/lib/tmdb-api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";

interface UserReviewsProps {
  movieId: number;
  className?: string;
  initialLimit?: number;
}

interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export default function UserReviews({ movieId, className, initialLimit = 3 }: UserReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getMovieReviews(movieId);
        setReviews(response.results);
        setTotalReviews(response.total_results);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('/https://')) {
      return avatarPath.substring(1); // Remove leading slash for external URLs
    }
    return `https://image.tmdb.org/t/p/w64${avatarPath}`;
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, initialLimit);

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold">User Reviews</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse w-full" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold">User Reviews</h3>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold">User Reviews</h3>
        <p className="text-muted-foreground text-sm">No reviews available for this movie.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          User Reviews {totalReviews > 0 && `(${totalReviews})`}
        </h3>
      </div>

      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border border-border rounded-lg p-4 space-y-3">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  {getAvatarUrl(review.author_details.avatar_path) ? (
                    <Image
                      src={getAvatarUrl(review.author_details.avatar_path)!}
                      alt={review.author}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {review.author_details.name || review.author}
                    </span>
                    {review.author_details.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {review.author_details.rating}/10
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={review.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>

            {/* Review Content */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {showAll || review.content.length <= 500 
                  ? review.content 
                  : truncateText(review.content, 500)
                }
              </p>
            </div>

            {/* Show more button for long reviews */}
            {!showAll && review.content.length > 500 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(true)}
                className="text-primary"
              >
                Read more
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Show more/less reviews button */}
      {reviews.length > initialLimit && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${totalReviews} Reviews`}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Reviews are provided by TMDB users and may contain spoilers.
      </p>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import MovieCarouselGrid from "@/components/movie-contents/MovieCarouselGrid";
import AdvancedMovieFilters from "@/components/AdvancedMovieFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Globe, Languages, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import SetPreferenceBadge from "@/components/ui/notification-badges/set-preference";

interface YourSpaceData {
  section: string;
  region: string;
  language: string;
  languageName: string;
  genres: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movies: any[];
  total_results: number;
}

export default function YourSpacePage() {
  const { data: session, status } = useSession();
  const hasLoadedData = useRef(false);
  const [newReleases, setNewReleases] = useState<YourSpaceData | null>(null);
  const [popular, setPopular] = useState<YourSpaceData | null>(null);
  const [upcoming, setUpcoming] = useState<YourSpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrefBadge, setShowPrefBadge] = useState(false);

  useEffect(() => {
    if (session?.user && !hasLoadedData.current) {
      fetchAllSections();
    }
  }, [session]);

  const fetchAllSections = async () => {
    setLoading(true);
    try {
      // Add timestamp to prevent any caching
      const timestamp = Date.now();
      const [newReleasesData, popularData, upcomingData] = await Promise.all([
        fetch(`/api/your-space?section=new-releases&_t=${timestamp}`, { cache: "no-store" }).then(r => r.json()),
        fetch(`/api/your-space?section=popular&_t=${timestamp}`, { cache: "no-store" }).then(r => r.json()),
        fetch(`/api/your-space?section=upcoming&_t=${timestamp}`, { cache: "no-store" }).then(r => r.json()),
      ]);

      setNewReleases(newReleasesData);
      setPopular(popularData);
      setUpcoming(upcomingData);
      // Show badge if popular section indicates missing preferences
      const needsPreferences = !popularData || !popularData.genres || popularData.genres.length === 0;
      setShowPrefBadge(needsPreferences);
      hasLoadedData.current = true; // Mark data as loaded
    } catch (error) {
      console.error("Failed to fetch your space data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="space-y-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your personalized movie space.
          </p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Preference CTA badge overlay when preferences missing */}
      <SetPreferenceBadge
        open={showPrefBadge}
        onClose={() => setShowPrefBadge(false)}
        onOpenPreferences={() => {
          setShowPrefBadge(false);
          window.location.href = "/profile?openPreferences=true";
        }}
      />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full bg-gradient-to-r from-primary/20 to-background border border-border rounded-2xl p-6 md:p-8 lg:p-12 mb-8 overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Your Space
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            Movies curated just for you, based on your language and genre preferences.
          </p>

          {/* Personalization Info */}
          {!loading && popular && (
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-2">
                <Globe className="h-4 w-4" />
                {popular.region === 'IN' ? 'India' : popular.region}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Languages className="h-4 w-4" />
                {popular.languageName}
              </Badge>
              {popular.genres && popular.genres.length > 0 && (
                <Badge variant="outline">
                  {popular.genres.length} favorite genre{popular.genres.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}

          {/* No Preferences Warning */}
          {!loading && popular && (!popular.genres || popular.genres.length === 0) && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Set your favorite genres in{" "}
                <Link href="/profile" className="text-primary hover:underline">
                  your profile
                </Link>{" "}
                to get even more personalized recommendations!
              </p>
            </div>
          )}
        </div>

        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-12 right-32 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </motion.section>

      {/* Advanced Filters */}
      {!loading && popular && (
        <AdvancedMovieFilters
          initialRegion={popular.region}
          initialLanguage={popular.language}
          initialGenres={popular.genres || []}
        />
      )}

      {/* Movie Sections */}
      <div className="space-y-12">
        {loading ? (
          <>
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </>
        ) : (
          <>
            {/* New Releases */}
            {newReleases && newReleases.movies && newReleases.movies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <MovieCarouselGrid
                  movies={newReleases.movies.slice(0, 20)}
                  title={`New ${newReleases.languageName} Releases`}
                />
              </motion.div>
            )}

            {/* Popular */}
            {popular && popular.movies && popular.movies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MovieCarouselGrid
                  movies={popular.movies.slice(0, 20)}
                  title={`Popular ${popular.languageName} Movies`}
                />
              </motion.div>
            )}

            {/* Upcoming */}
            {upcoming && upcoming.movies && upcoming.movies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MovieCarouselGrid
                  movies={upcoming.movies.slice(0, 20)}
                  title={`Upcoming ${upcoming.languageName} Movies`}
                />
              </motion.div>
            )}

            {/* No Results */}
            {newReleases?.movies?.length === 0 &&
              popular?.movies?.length === 0 &&
              upcoming?.movies?.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-4">No Movies Found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find movies matching your preferences. Try updating your{" "}
                    <Link href="/profile" className="text-primary hover:underline">
                      language settings
                    </Link>
                    .
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/movies">Browse All Movies</Link>
                  </Button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

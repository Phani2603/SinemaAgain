"use client";

import { useState, useEffect } from "react";
import { tmdbApi } from "@/lib/tmdb-api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, ShoppingCart } from "lucide-react";

interface WatchProvidersProps {
  movieId: number;
  className?: string;
  region?: string;
}

interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface WatchProviderData {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

export default function WatchProviders({ movieId, className, region = 'US' }: WatchProvidersProps) {
  const [watchData, setWatchData] = useState<WatchProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getMovieWatchProviders(movieId, region);
        
        if (response.results[region]) {
          setWatchData(response.results[region]);
        } else {
          setWatchData(null);
        }
      } catch (err) {
        console.error('Error fetching watch providers:', err);
        setError('Failed to load streaming information');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchProviders();
  }, [movieId, region]);

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold">Where to Watch</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24" />
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-12 h-12 bg-muted rounded animate-pulse" />
                ))}
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
        <h3 className="text-lg font-semibold">Where to Watch</h3>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  if (!watchData) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold">Where to Watch</h3>
        <p className="text-muted-foreground text-sm">
          Streaming information not available for your region.
        </p>
      </div>
    );
  }

  const ProviderSection = ({ 
    title, 
    providers, 
    icon: Icon 
  }: { 
    title: string; 
    providers: Provider[]; 
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <h4 className="font-medium text-sm">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 min-w-0"
          >
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                fill
                className="rounded object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-xs truncate">{provider.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Where to Watch</h3>
        {watchData.link && (
          <Button variant="outline" size="sm" asChild>
            <a href={watchData.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              JustWatch
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {watchData.flatrate && watchData.flatrate.length > 0 && (
          <ProviderSection
            title="Stream"
            providers={watchData.flatrate}
            icon={Play}
          />
        )}

        {watchData.rent && watchData.rent.length > 0 && (
          <ProviderSection
            title="Rent"
            providers={watchData.rent}
            icon={ExternalLink}
          />
        )}

        {watchData.buy && watchData.buy.length > 0 && (
          <ProviderSection
            title="Buy"
            providers={watchData.buy}
            icon={ShoppingCart}
          />
        )}

        {!watchData.flatrate && !watchData.rent && !watchData.buy && (
          <p className="text-muted-foreground text-sm">
            No streaming options available for your region.
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Streaming data provided by JustWatch. Availability may vary by region.
      </p>
    </div>
  );
}
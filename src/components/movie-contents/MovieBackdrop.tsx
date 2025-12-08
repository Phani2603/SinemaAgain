"use client";

import { useState } from "react";
import Image from "next/image";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Backdrop {
  file_path: string;
  width: number;
  height: number;
}

interface MovieBackdropProps {
  backdrops: Backdrop[];
  defaultBackdrop: string | null;
  movieTitle: string;
}

export default function MovieBackdrop({ backdrops, defaultBackdrop, movieTitle }: MovieBackdropProps) {
  // Get initial backdrop - random from available or default
  const getInitialBackdrop = () => {
    if (backdrops && backdrops.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(backdrops.length, 10));
      return `https://image.tmdb.org/t/p/original${backdrops[randomIndex].file_path}`;
    }
    return defaultBackdrop
      ? `https://image.tmdb.org/t/p/original${defaultBackdrop}`
      : "/placeholder-backdrop.svg";
  };

  const [currentBackdrop, setCurrentBackdrop] = useState(getInitialBackdrop());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeBackdrop = () => {
    if (!backdrops || backdrops.length <= 1) return;
    
    setIsTransitioning(true);
    
    // Find a different backdrop
    const availableBackdrops = backdrops.map(b => `https://image.tmdb.org/t/p/original${b.file_path}`);
    const otherBackdrops = availableBackdrops.filter(b => b !== currentBackdrop);
    
    if (otherBackdrops.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherBackdrops.length);
      setCurrentBackdrop(otherBackdrops[randomIndex]);
    }
    
    // Reset transition after animation completes
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const hasMultipleBackdrops = backdrops && backdrops.length > 1;

  return (
    <>
      {/* Backdrop Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={currentBackdrop}
          alt={movieTitle}
          fill
          className={`object-cover transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
          priority
          quality={95}
        />
      </div>

      {/* Change Backdrop Button */}
      {hasMultipleBackdrops && (
        <div className="absolute bottom-6 md:bottom-8 right-4 md:right-6 z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={changeBackdrop}
            className="rounded-full shadow-lg backdrop-blur-sm bg-background/80 hover:bg-background/90"
            title="Change backdrop"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}

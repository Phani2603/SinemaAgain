"use client";

import { useState } from "react";
import WatchlistButton from "./WatchlistButton";
import RecommendMovieDialog from "@/components/RecommendMovieDialog";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

interface MovieActionButtonsProps {
  movieId: number;
  movieTitle: string;
}

export default function MovieActionButtons({ movieId, movieTitle }: MovieActionButtonsProps) {
  const { data: session } = useSession();
  const [recommendDialogOpen, setRecommendDialogOpen] = useState(false);

  return (
    <>
      <WatchlistButton 
        movieId={movieId} 
        movieTitle={movieTitle}
        className="px-6 py-2"
      />
      
      {session?.user && (
        <Button
          variant="outline"
          onClick={() => setRecommendDialogOpen(true)}
          className="px-6 py-2 border-primary/50 hover:bg-primary/10"
        >
          <Send className="w-4 h-4 mr-2" />
          Recommend
        </Button>
      )}

      <RecommendMovieDialog
        open={recommendDialogOpen}
        onOpenChange={setRecommendDialogOpen}
        movieId={movieId}
        movieTitle={movieTitle}
      />
    </>
  );
}

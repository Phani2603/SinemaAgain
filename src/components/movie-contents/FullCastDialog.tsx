"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface FullCastDialogProps {
  cast: CastMember[];
}

export default function FullCastDialog({ cast }: FullCastDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View All Cast →
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">Full Cast</DialogTitle>
        </DialogHeader>
        
        {/* Scrollable Cast Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.map((person) => (
              <Link 
                href={`/people/${person.id}`} 
                key={person.id} 
                className="group"
              >
                <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden mb-2 ring-1 ring-border group-hover:ring-primary transition-all group-hover:scale-105 shadow-sm">
                  <Image
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : "/placeholder-person.svg"
                    }
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-xs leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {person.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {person.character}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

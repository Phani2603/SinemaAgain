import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MovieNotFound() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Sorry, we couldn&apos;t find the movie you&apos;re looking for.
      </p>
      <Button asChild>
        <Link href="/movies">
          Browse All Movies
        </Link>
      </Button>
    </div>
  );
}
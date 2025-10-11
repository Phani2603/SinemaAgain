import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SearchNotFound() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">No Search Results</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We couldn&apos;t find any movies matching your search.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="default">
          <Link href="/movies">
            Browse All Movies
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/movies/search">
            Try Another Search
          </Link>
        </Button>
      </div>
    </div>
  );
}
import Link from "next/link";
import TMDBAttribution from "@/components/ui/tmdb-attribution";

export default function Footer() {
  return (
    <footer className="border-t py-8 mt-12 bg-background">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <TMDBAttribution />
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <div className="flex gap-4">
              <Link 
                href="/legal/terms" 
                className="hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/legal/privacy" 
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
            </div>
            
            <div className="text-muted-foreground">
              © 2025 SinemaAgain. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
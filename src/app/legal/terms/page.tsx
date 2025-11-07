import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - SinemaAgain",
  description: "Terms of service and usage guidelines for SinemaAgain movie discovery platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. About This Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              SinemaAgain is a movie discovery application that helps users find and explore movies. 
              This service uses data from The Movie Database (TMDB) API to provide movie information, 
              images, and related content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data Sources</h2>
            <p className="text-muted-foreground leading-relaxed">
              All movie data, images, and information displayed on this platform are provided by 
              The Movie Database (TMDB) and are used in compliance with their terms of service. 
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Content Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not host any copyrighted movie content. All movie posters, backdrops, and 
              promotional materials are served directly from TMDB&apos;s content delivery network. 
              Trailers are embedded from YouTube using their official embed API.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              Users are expected to use this service for legitimate movie discovery purposes. 
              Any attempt to misuse the service, extract data for commercial purposes, or 
              violate our rate limits is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              This service is provided &ldquo;as is&rdquo; without warranties. Movie data accuracy depends 
              on TMDB&apos;s database. We are not responsible for any decisions made based on the 
              information provided through this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these terms or our service, please contact us through our 
              GitHub repository or create an issue for support.
            </p>
          </section>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> November 7, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
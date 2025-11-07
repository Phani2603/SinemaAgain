import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - SinemaAgain",
  description: "Privacy policy and data handling practices for SinemaAgain movie discovery platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not collect, store, or process any personal data. SinemaAgain is designed 
              to work without requiring user accounts, personal information, or tracking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Movie data is fetched directly from The Movie Database (TMDB) public API in 
              real-time. We do not store or cache any movie information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Services</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
              <p><strong>The Movie Database (TMDB):</strong> Provides movie data and images</p>
              <p><strong>YouTube:</strong> Embedded trailers using their public embed API</p>
              <p><strong>Streaming Services:</strong> Links to legal viewing options</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookies and Local Storage</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use minimal browser storage for user preferences like theme settings. 
              No personal data or tracking information is stored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Since we do not collect personal data, there are no personal data security 
              concerns. All movie data comes directly from TMDB&apos;s secure API.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              If we ever add features that collect personal data, we will update this 
              privacy policy and notify users accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related questions, please contact us through our GitHub repository.
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
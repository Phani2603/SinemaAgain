import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemedGridBackground } from "@/components/ui/gridBackground";
import HeroSection from "@/components/Landing/HeroSection";
import FeatureSection from "@/components/Landing/FeatureSection";
import CTA2 from "@/components/Landing/CTA2";
import Footer from "@/components/Landing/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Load CTA2 only on client to avoid SSR issues when the component
// is a client component or uses browser-only APIs.


export default async function Home() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  // If user is logged in, redirect to movies page
  if (session) {
    redirect("/movies");
  }
  return (
    <ThemedGridBackground>
      <div className="w-full">
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
          <ThemeSwitcher />
        </div>
        
        <HeroSection />
        <FeatureSection />
        <div className="w-full flex justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12 mt-12 mb-6">
          <CTA2 />
        </div>
        <Footer />
      </div>
    </ThemedGridBackground>
  );
}

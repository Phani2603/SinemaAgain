import type { Metadata } from "next";
import { Geist, Geist_Mono, Jost, Exo_2, Telex } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {  ThemeTransitionProviderCurtain } from "@/components/theme-transition";
import Footer from "@/components/Layout/Footer";
import SessionProvider from "@/components/SessionProvider";
import FloatingComponents from "@/components/FloatingComponents";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { Toaster } from "@/components/ui/sonner";

// Geist fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Telex font
const telexFont = Telex({
  weight: ["400"],  // Telex only has regular weight
  subsets: ["latin"],
  variable: "--font-telex",
  display: "swap",
});

// Jost font - all weights
const jostFont = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Exo 2 font - all weights
const exo2Font = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo2",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SinemaAgain - Discover Movies",
  description: "Discover trending movies, search your favorites, and find where to watch them.",
  icons:{
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${telexFont.variable} ${jostFont.variable} ${exo2Font.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <WatchlistProvider>
            <ThemeTransitionProviderCurtain>
              
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                storageKey="sinema-theme"
              >
                <div className="min-h-screen flex flex-col">
                  <FloatingComponents />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster position="top-center" richColors expand={true} />
              </ThemeProvider>
              </ThemeTransitionProviderCurtain>
          </WatchlistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

export default function AuthenticatedNavbar() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="font-bold text-xl">
                SinemaAgain
              </Link>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  if (!session?.user) {
    return null; // Don't show navbar if not authenticated
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/movies" className="font-bold text-xl text-primary">
              SinemaAgain
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/movies" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Movies
              </Link>
              <Link 
                href="/watchlist" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Watchlist
              </Link>
              <Link 
                href="/friends" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Friends
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <span className="text-sm text-muted-foreground">
                Welcome, {session.user.name?.split(' ')[0] || 'User'}!
              </span>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
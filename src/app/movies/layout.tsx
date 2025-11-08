"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface MoviesLayoutProps {
  children: React.ReactNode;
}

export default function MoviesLayout({ children }: MoviesLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen">
        <main className="pt-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
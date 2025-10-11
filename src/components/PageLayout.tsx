"use client";

import { CustomNavbar } from "@/components/ui/custom-navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <CustomNavbar />
      
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50">
        <ThemeSwitcher />
      </div>
      
      {children}
    </div>
  );
}
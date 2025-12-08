"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  name: string;
  link?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarNavProps {
  navItems: NavItem[];
  className?: string;
}

export function SidebarNav({ navItems, className }: SidebarNavProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        className={cn(
          // Desktop: left side, vertically centered
          "hidden md:fixed md:left-4 md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col",
          // Mobile: bottom of screen, horizontally centered
          "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-row md:bottom-auto md:left-4 md:translate-x-0",
          // Styling
          "z-[4999] gap-1.5 p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl",
          className
        )}
      >
        {navItems.map((item, index) => {
          const isActive = item.link && (pathname === item.link || pathname.startsWith(item.link + '/'));
          
          const content = (
            <div
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-300 cursor-pointer",
                "hover:scale-110 active:scale-95",
                isActive
                  ? "bg-yellow-700/95 text-white shadow-lg shadow-purple-500/50 scale-105"
                  : "bg-white/5 text-gray-400 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-yellow-500/20 hover:text-white"
              )}
              onClick={item.onClick}
            >
              <div className="w-5 h-5">
                {item.icon}
              </div>
            </div>
          );
          
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                {item.link ? (
                  <Link href={item.link}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </TooltipTrigger>
              <TooltipContent 
                side={typeof window !== 'undefined' && window.innerWidth >= 768 ? "right" : "top"} 
                className={cn(
                  "font-medium",
                  theme === "dark" 
                    ? "bg-black/95 border-white/20 text-white" 
                    : "bg-white/95 border-black/20 text-black"
                )}
              >
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

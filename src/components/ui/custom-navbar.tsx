"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "text-sm hover:text-blue-500 cursor-pointer transition-colors",
        className
      )}
    >
      {children}
    </Link>
  );
};

interface CustomNavbarProps {
  links?: {
    name: string;
    href: string;
  }[];
  className?: string;
  logo?: React.ReactNode;
  ctaButton?: {
    text: string;
    href: string;
  };
}

export function CustomNavbar({
  links = [
    { name: "Movies", href: "/movies" },
    { name: "Theaters", href: "/theaters" },
    { name: "Experience", href: "/experience" },
    { name: "About Us", href: "/about" },
  ],
  className,
  logo = "Sinema",
  ctaButton = {
    text: "Get Started",
    href: "/auth/signin",
  },
}: CustomNavbarProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position to create hide/show effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show navbar if:
      // 1. Scrolling up (scrollPosition > currentScrollPos)
      // 2. At the top of the page (currentScrollPos < 10)
      setShowNavbar(scrollPosition > currentScrollPos || currentScrollPos < 10);
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPosition]);

  return (
    <>
      <motion.div 
        className={cn(
          "sticky top-0 inset-x-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50 transition-all duration-300 border-b border-border/40",
          !showNavbar && "-translate-y-full opacity-0",
          showNavbar && "translate-y-0 opacity-100 shadow-sm",
          className
        )}
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: showNavbar ? 0 : -100,
          opacity: showNavbar ? 1 : 0
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="font-medium text-base sm:text-lg">
              {typeof logo === 'string' ? logo : logo}
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-5 lg:gap-8">
              {links.map((link, index) => (
                <NavLink key={index} href={link.href}>
                  {link.name}
                </NavLink>
              ))}
              <Link href={ctaButton.href}>
                <Button 
                  className="font-medium bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {ctaButton.text}
                </Button>
              </Link>
            </div>
            
            <div className="md:hidden flex items-center">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 focus:outline-none"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground"
                >
                  {mobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile Menu with overlay */}
      {mobileMenuOpen && (
        <>
          {/* Overlay for z-axis with higher z-index */}
          <div 
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div 
            className="md:hidden fixed inset-x-0 top-[56px] bg-white dark:bg-black border-y border-border z-50 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {links.map((link, index) => (
                <NavLink key={index} href={link.href} className="px-2 py-1">
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-2">
                <Link href={ctaButton.href} className="block w-full">
                  <Button 
                    className="font-medium bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 w-full"
                  >
                    {ctaButton.text}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
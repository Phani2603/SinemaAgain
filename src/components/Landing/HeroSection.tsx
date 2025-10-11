"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DeviceDisplay from "./DeviceDisplay";
import PhoneMockup from "./PhoneMockup";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle,
  NavbarButton 
} from "../ui/resizable-navbar";

// We'll export this for use elsewhere if needed
export const ShimmerButton = ({ 
  children, 
  className,
  href
}: { 
  children: React.ReactNode; 
  className?: string;
  href?: string;
}) => {
  return (
    <Link href={href || "#"}>
      <motion.div
        className={cn(
          "relative inline-flex h-9 sm:h-10 overflow-hidden rounded-md px-3 sm:px-4 py-1 sm:py-2 focus:outline-none",
          className
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center text-xs sm:text-sm font-medium">
          {children}
        </span>
      </motion.div>
    </Link>
  );
};

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: "Movies", link: "/movies" },
    { name: "Theaters", link: "/theaters" },
    { name: "Experience", link: "/experience" },
    { name: "About Us", link: "/about" },
  ];

  return (
    <div className="relative w-full min-h-screen flex font-jost items-center overflow-hidden bg-white dark:bg-black">
      <Navbar className="fixed top-0 !inset-x-0 z-50">
        <NavBody className="bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <a
            href="#"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >
            <span className="font-medium text-xl text-black dark:text-white">Sinema</span>
          </a>
          <NavItems items={navItems} />
          <div className="relative z-30 ml-auto">
            <NavbarButton href="/movies" variant="primary" className="bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700">
              Get Started
            </NavbarButton>
          </div>
        </NavBody>
        <MobileNav className="bg-white/80 dark:bg-black/80 backdrop-blur-sm">
          <MobileNavHeader>
            <a
              href="#"
              className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
            >
              <span className="font-medium text-xl text-black dark:text-white">Sinema</span>
            </a>
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="w-full text-sm font-medium text-neutral-600 dark:text-neutral-300 px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <NavbarButton href="/movies" variant="primary" className="w-full mt-4 bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700">
              Get Started
            </NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-16 md:pb-20">
        {/* Non-sticky spacer for content positioning */}
        <div className="pt-8 sm:pt-12 md:pt-16 mb-8 sm:mb-12 md:mb-16"></div>
        
        <div className="flex flex-col items-center pt-4 sm:pt-8 md:pt-0">
          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-exo2 font-bold mb-6 sm:mb-10 md:mb-16 text-center max-w-4xl px-2"
          >
            Browse everything<span className="text-blue-500">.</span>
          </motion.h1>
          
          {/* Hero CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mb-10"
          >
            <ShimmerButton href="/movies" className="font-medium bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 border-none px-6 py-3 text-base">
              Explore Movies
            </ShimmerButton>
          </motion.div>
          
          {/* Device display with visualization - responsive */}
          <div className="w-full relative">
            {/* Olive green background block (added here in HeroSection for more visibility) */}
            <div 
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-[1200px] h-72 sm:h-64 md:h-124 rounded-4xl"
              style={{ backgroundColor: "#8E9B77" }}
            ></div>
            {/* <div 
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-[1200px] z-15 h-10 sm:h-16 md:h-12 rounded-lg"
              style={{ backgroundColor: "#707a50" }}
            ></div> */}
            
            {/* For larger screens - Desktop version */}
            <div className="hidden sm:block relative z-10">
              <DeviceDisplay />
            </div>
            
            {/* For mobile screens */}
            <div className="block sm:hidden w-full max-w-xs mx-auto relative z-10">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-8 right-8 w-16 h-16 border border-foreground/10 rounded-full opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1 }}
      />
      <motion.div 
        className="absolute top-20 left-10 w-12 h-12 border border-foreground/10 rounded-full opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2 }}
      />
    </div>
  );
}

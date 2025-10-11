"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ThemeTransitionContextType = {
  triggerTransition: (callback?: () => void) => void;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(undefined);

export function useThemeTransition() {
  const context = useContext(ThemeTransitionContext);
  if (!context) throw new Error("useThemeTransition must be used within a ThemeTransitionProvider");
  return context;
}

// Choose one of these effects:

// 1. WIPE EFFECT - Smooth horizontal wipe
export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => callback?.(), 300);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0 }}
            className="fixed inset-y-0 left-0 z-50 w-full"
            style={{
              backgroundColor: "hsl(var(--background))",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}

// 2. CURTAIN EFFECT - Elegant top-to-bottom reveal
export function ThemeTransitionProviderCurtain({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => callback?.(), 400);
    setTimeout(() => setIsTransitioning(false), 900);
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ 
              scaleY: 1, 
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
            }}
            exit={{ 
              scaleY: 0, 
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
            }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "hsl(var(--background))",
              pointerEvents: "none",
              transformOrigin: "top",
            }}
          />
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}

// 3. FADE + ZOOM - Subtle and modern
export function ThemeTransitionProviderZoom({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => callback?.(), 250);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.3, ease: "easeOut" } 
            }}
            exit={{ 
              opacity: 0,
              scale: 1.05,
              transition: { duration: 0.3, ease: "easeIn" } 
            }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "hsl(var(--background))",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}

// 4. SPLIT DOORS - Dramatic center split
export function ThemeTransitionProviderSplit({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => callback?.(), 350);
    setTimeout(() => setIsTransitioning(false), 900);
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <>
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: "-100%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ x: "-100%", opacity: 0, transition: { duration: 0.4 } }}
              className="fixed inset-y-0 left-0 z-50 w-1/2"
              style={{
                backgroundColor: "hsl(var(--background))",
                pointerEvents: "none",
              }}
            />
            <motion.div
              initial={{ x: "0%" }}
              animate={{ x: "100%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ x: "100%", opacity: 0, transition: { duration: 0.4 } }}
              className="fixed inset-y-0 right-0 z-50 w-1/2"
              style={{
                backgroundColor: "hsl(var(--background))",
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}

// 5. CORNER REVEAL - Diagonal swipe from corner
export function ThemeTransitionProviderCorner({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (callback?: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => callback?.(), 300);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ 
              clipPath: "circle(150% at 100% 0%)",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: "hsl(var(--background))",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}
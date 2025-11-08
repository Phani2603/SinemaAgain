"use client";

import { useTheme } from "next-themes";
import { useThemeTransition } from "./theme-transition";
import { ModeToggle } from "@/components/mode-toggle";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();
  const { triggerTransition } = useThemeTransition();

  // Function to handle theme change with animation
  const handleThemeChange = (newTheme: string) => {
    // Start animation first
    triggerTransition(() => {
      // Change theme mid-way through animation
      setTheme(newTheme);
    });
  };

  return <ModeToggle onThemeChange={handleThemeChange} />;
}

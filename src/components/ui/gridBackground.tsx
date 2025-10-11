"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemedGridBackground({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set default colors
  const defaultIsDark = false; // Default to light mode
  const defaultGridColor = "#e2e8f0"; // Light mode grid color
  const defaultBgColor = "#f8fafc";   // Light mode background

  // Wait for component to mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use theme after component is mounted
  const isDark = mounted ? resolvedTheme === "dark" : defaultIsDark;
  const gridColor = isDark ? "#333333" : "#e2e8f0";
  const bgColor = isDark ? "#000000" : "#f8fafc";

  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: mounted ? bgColor : defaultBgColor }}>
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${mounted ? gridColor : defaultGridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${mounted ? gridColor : defaultGridColor} 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      {/* Your content/components */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

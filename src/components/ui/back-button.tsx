"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React from "react";

type BackButtonProps = {
  className?: string;
  label?: string;
  fallbackHref?: string;
};

/**
 * A small back button that prefers history.back() and falls back to a link.
 */
export function BackButton({ className, label = "← Back", fallbackHref = "/movies" }: BackButtonProps) {
  const router = useRouter();

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          // Attempt to go back; if no history, navigate to fallback
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push(fallbackHref);
          }
        }}
        aria-label="Go back"
      >
        {label}
      </Button>
    </div>
  );
}

export default BackButton;

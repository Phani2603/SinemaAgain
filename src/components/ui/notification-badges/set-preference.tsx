"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";

interface SetPreferenceBadgeProps {
  open: boolean;
  onClose: () => void;
  onOpenPreferences?: () => void;
}

/**
 * SetPreferenceBadge
 * A modal-like notification CTA prompting users to set preferences.
 * Shows with a blurred backdrop and rounded card, with a close button.
 */
export default function SetPreferenceBadge({ open, onClose }: SetPreferenceBadgeProps) {
  // Prevent body scroll when badge is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl"
          >
            <Card className="rounded-[28px] shadow-2xl border-border overflow-hidden bg-gradient-to-r from-[#D64A3C] via-[#FF6A5B] to-[#FFB39E] dark:from-orange-700/80 dark:via-orange-500/70 dark:to-orange-300/60">
              {/* Close button inside badge at top-right */}
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col md:flex-row min-h-[400px]">
                {/* Left side - Image (60%) */}
                <div className="w-full md:w-[60%] flex items-center justify-center p-4 md:p-10">
                  <Image
                    src="/web-maintenance.svg"
                    alt="Set preferences"
                    width={500}
                    height={500}
                    priority
                    className="max-w-full h-auto"
                  />
                </div>

                {/* Right side - Content (40%) */}
                <div className="w-full md:w-[40%] p-6 md:p-8 flex flex-col justify-center">
                  <div className="space-y-3 md:space-y-4 font-jost">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Let&apos;s Personalize Your Space.
                    </h2>
                    <p className="text-sm md:text-base text-white/90">
                      Set your region, languages, and favorite genres to improve recommendations.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button asChild className="w-full rounded-full bg-black text-white hover:bg-black/90">
                      <a href="/profile">Go to Profile</a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

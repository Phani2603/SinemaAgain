"use client";

import { motion } from "framer-motion";
import { Film, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Film Reel Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center"
            >
              <Film className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-4 border-primary/10"
            />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-9xl font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Scene Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-2">
            Looks like this page took an unscheduled intermission.
          </p>
          <p className="text-sm text-muted-foreground">
            The content you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </motion.div>

        {/* Animated Film Strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex justify-center gap-2 mb-12"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-12 h-16 bg-primary/10 border-2 border-primary/30 rounded"
            >
              <div className="h-full flex flex-col justify-between p-1">
                <div className="w-full h-2 bg-primary/20 rounded" />
                <div className="w-full h-2 bg-primary/20 rounded" />
                <div className="w-full h-2 bg-primary/20 rounded" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => router.back()}
            variant="outline"
            className="group relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10">Go Back</span>
          </Button>

          <Button
            size="lg"
            asChild
            className="group relative overflow-hidden"
          >
            <Link href="/">
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Home</span>
            </Link>
          </Button>

          <Button
            size="lg"
            asChild
            variant="outline"
            className="group relative overflow-hidden"
          >
            <Link href="/movies">
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Browse Movies</span>
            </Link>
          </Button>
        </motion.div>

        {/* Fun Movie Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 pt-8 border-t border-border/50"
        >
          <p className="text-sm text-muted-foreground italic">
            &quot;Houston, we have a problem!!&nbsp;— Apollo 13&quot;
          </p>
        </motion.div>
      </div>
    </div>
  );
}

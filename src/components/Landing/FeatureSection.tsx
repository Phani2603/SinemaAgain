"use client";

import { motion } from "framer-motion";
import FeatureCarousel from "../ui/feature-carousel";

export default function FeatureSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold mb-4 sm:text-4xl md:text-5xl font-jost tracking-tight"
          >
            Discover Amazing Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-jost leading-relaxed"
          >
            Explore the innovative features that make our platform stand out from the rest
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <FeatureCarousel
            title="Immersive Movie Experience"
            description="Discover a seamless way to explore and enjoy your favorite movies with our innovative features"
            image={{
              step1light1: "https://images.unsplash.com/photo-1627873649417-c67f701f1949?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
              step1light2: "https://images.unsplash.com/photo-1512070679279-8988d32161be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2678&q=80",
              step2light1: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2500&q=80",
              step2light2: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
              step3light: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
              step4light: "https://images.unsplash.com/photo-1568876694728-451bbf694b83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2549&q=80",
              alt: "Sinema features showcase",
            }}
            bgClass="bg-gradient-to-tr from-blue-900/90 to-purple-800/90"
          />
        </div>
      </div>
    </section>
  );
}

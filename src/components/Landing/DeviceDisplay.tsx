"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DeviceDisplay = () => {
  // State to detect viewport sizes
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

  // Effect to check viewport width on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-[90vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >

      {/* Olive green background block in DeviceDisplay */}
      <div 
        className="absolute bottom-0 left-0 right-0 w-full h-28 sm:h-36 md:h-48 bg-[#707a50] rounded-lg" 
        
      ></div>

      {/* Device frame */}
      <div className="relative w-full aspect-[16/9] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-xl z-10">
        {/* Screen content - Movie dashboard */}
        <div className="absolute inset-0 bg-black p-2 xs:p-3 sm:p-4 flex flex-col">
          {/* Top bar with indicators */}
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full bg-red-500"></div>
              <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="text-[10px] xs:text-xs text-zinc-400 hidden xs:block">Sinema Dashboard</div>
            <div className="text-[10px] xs:text-xs text-zinc-400 hidden sm:block">Premium Experience</div>
          </div>
          
          {/* Main visualization area - responsive layout */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Left panel - Movie stats */}
            <div className="bg-zinc-900/50 rounded-lg p-2 sm:p-3 md:p-4 flex flex-col col-span-1">
              <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-white">Top Movies</h3>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-zinc-400">This Week</div>
              </div>
              
              {/* Movie ratings - Responsive version */}
              <div className="space-y-1.5 xs:space-y-2 sm:space-y-3">
                {[
                  { title: "Dune: Part Two", rating: 92 },
                  { title: "Oppenheimer", rating: 88 },
                  { title: "The Batman", rating: 85 },
                  { title: "Everything Everywhere", rating: 95 },
                  { title: "Interstellar", rating: 83 },
                ].map((movie, index) => {
                  // On extremely small screens, only show top 3
                  if (index > 2 && windowWidth < 375) return null;
                  
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-1.5 sm:gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[9px] xs:text-[10px] md:text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="text-[8px] xs:text-[10px] sm:text-xs text-zinc-200 truncate">{movie.title}</div>
                        <div className="h-1 sm:h-1.5 bg-zinc-800 rounded-full w-full mt-0.5 sm:mt-1 overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${movie.rating}%` }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <div className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-zinc-300">{movie.rating}%</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Center panel - Current movies */}
            <div className="bg-zinc-900/50 rounded-lg p-2 sm:p-3 md:p-4 flex flex-col col-span-2">
              <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-white">Now Showing</h3>
                <div className="text-[9px] xs:text-[10px] sm:text-xs text-blue-400 cursor-pointer">View All</div>
              </div>
              
              {/* Movie cards grid - responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 mt-1 sm:mt-2">
                {[
                  { title: "Dune: Part Two", genre: "Sci-Fi", color: "from-orange-500 to-amber-700" },
                  { title: "Poor Things", genre: "Drama", color: "from-green-500 to-teal-700" },
                  { title: "Civil War", genre: "Action", color: "from-red-500 to-rose-700" },
                  { title: "Godzilla x Kong", genre: "Action", color: "from-blue-500 to-indigo-700" },
                ].map((movie, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-sm sm:rounded-md overflow-hidden bg-gradient-to-br ${movie.color} aspect-[2/3] relative cursor-pointer`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2">
                      <div className="text-white text-[8px] xs:text-[10px] sm:text-xs font-medium truncate">{movie.title}</div>
                      <div className="text-white/70 text-[6px] xs:text-[8px] sm:text-[10px]">{movie.genre}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Stats row - responsive */}
              <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 mt-2 sm:mt-3 md:mt-4">
                <motion.div 
                  className="bg-zinc-800/50 rounded p-1 sm:p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="text-[8px] xs:text-[10px] sm:text-xs text-zinc-400">Movies</div>
                  <div className="text-xs sm:text-sm md:text-lg font-medium text-white mt-0.5 sm:mt-1">152</div>
                </motion.div>
                <motion.div 
                  className="bg-zinc-800/50 rounded p-1 sm:p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="text-[8px] xs:text-[10px] sm:text-xs text-zinc-400">Theaters</div>
                  <div className="text-xs sm:text-sm md:text-lg font-medium text-white mt-0.5 sm:mt-1">48</div>
                </motion.div>
                <motion.div 
                  className="bg-zinc-800/50 rounded p-1 sm:p-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-[8px] xs:text-[10px] sm:text-xs text-zinc-400">Upcoming</div>
                  <div className="text-xs sm:text-sm md:text-lg font-medium text-white mt-0.5 sm:mt-1">37</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      </div>
      
      {/* Shadow under device - responsive */}
      <div className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 left-1/2 transform -translate-x-1/2 w-[70%] sm:w-[75%] md:w-4/5 h-6 sm:h-8 md:h-12 bg-black/20 blur-md sm:blur-lg md:blur-xl rounded-full z-10"></div>
      
      {/* Responsive alternative view for extremely small screens - shown when needed */}
      {windowWidth < 360 && (
        <motion.div 
          className="absolute bottom-2 left-4 right-4 text-center text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
        >
          For best experience, view on a larger screen
        </motion.div>
      )}
    </motion.div>
  );
};

export default DeviceDisplay;
"use client";

import { motion } from "framer-motion";

const PhoneMockup = () => {
  return (
    <motion.div
      className="relative w-full max-w-xs mx-auto mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Phone frame */}
      <div className="relative w-full aspect-[9/19] rounded-[2.5rem] overflow-hidden border-8 border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-6 bg-zinc-800 rounded-b-xl z-10"></div>
        
        {/* Screen content */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black overflow-hidden flex flex-col">
          {/* Status bar */}
          <div className="flex justify-between items-center py-2 px-4 h-6">
            <div className="text-[10px] text-zinc-300 font-medium">9:41</div>
            <div className="flex items-center gap-1">
              <div className="text-[10px] text-zinc-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 10L21 7V17L18 14M12 12C12 10.4 13.4 9 15 9V15C13.4 15 12 13.6 12 12ZM3 9H7L10 12L7 15H3V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-[10px] text-zinc-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 21V19C4 17.1362 4.7375 15.5701 6.2125 14.0951C7.6875 12.6201 9.25 12 11 12C12.75 12 14.3125 12.6201 15.7875 14.0951C17.2625 15.5701 18 17.1362 18 19V21M14 7C14 8.06087 13.5786 9.07828 12.8284 9.82843C12.0783 10.5786 11.0609 11 10 11C8.93913 11 7.92172 10.5786 7.17157 9.82843C6.42143 9.07828 6 8.06087 6 7C6 5.93913 6.42143 4.92172 7.17157 4.17157C7.92172 3.42143 8.93913 3 10 3C11.0609 3 12.0783 3.42143 12.8284 4.17157C13.5786 4.92172 14 5.93913 14 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-[10px] text-zinc-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 18H19C19.2652 18 19.5196 17.8946 19.7071 17.7071C19.8946 17.5196 20 17.2652 20 17V7C20 6.73478 19.8946 6.48043 19.7071 6.29289C19.5196 6.10536 19.2652 6 19 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7V17C4 17.2652 4.10536 17.5196 4.29289 17.7071C4.48043 17.8946 4.73478 18 5 18ZM4 8H20M7 21H17C17 20.7348 16.8946 20.4804 16.7071 20.2929C16.5196 20.1054 16.2652 20 16 20H8C7.73478 20 7.48043 20.1054 7.29289 20.2929C7.10536 20.4804 7 20.7348 7 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-0.5">
                <div className="h-2 w-0.5 bg-green-400 rounded"></div>
                <div className="h-3 w-0.5 bg-green-400 rounded"></div>
                <div className="h-4 w-0.5 bg-green-400 rounded"></div>
                <div className="h-2 w-0.5 bg-zinc-400 rounded"></div>
                <div className="h-2 w-0.5 bg-zinc-400 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* App header */}
          <div className="px-4 pt-2 pb-4 flex justify-between items-center">
            <div>
              <div className="text-xs text-zinc-400">Welcome to</div>
              <div className="text-lg font-bold text-white">Sinema</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {/* Featured movie */}
          <div className="px-4 mb-3">
            <div className="w-full aspect-[16/9] rounded-lg bg-gradient-to-br from-amber-600 to-red-800 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-3">
                <div className="text-white text-xs font-medium mb-1">Now Showing</div>
                <div className="text-white text-lg font-bold mb-1">Dune: Part Two</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xs text-white/80">Sci-Fi</div>
                  <div className="w-1 h-1 rounded-full bg-white/50"></div>
                  <div className="text-xs text-white/80">166 min</div>
                </div>
                
                <motion.button 
                  className="bg-blue-500 text-white text-xs font-medium py-1.5 px-3 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Tickets
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Now showing */}
          <div className="px-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-white">Now Showing</div>
              <div className="text-xs text-blue-400">See All</div>
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {[
                { title: "Poor Things", color: "from-green-600 to-teal-800" },
                { title: "Civil War", color: "from-red-600 to-rose-800" },
                { title: "Godzilla x Kong", color: "from-blue-600 to-indigo-800" },
              ].map((movie, index) => (
                <motion.div 
                  key={index} 
                  className={`flex-shrink-0 w-24 aspect-[2/3] rounded-md bg-gradient-to-br ${movie.color} relative`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-medium">
                    {movie.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Bottom navigation */}
          <div className="mt-auto border-t border-zinc-800 py-2 px-4 flex justify-between">
            <div className="flex flex-col items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-[9px] text-blue-500 mt-1">Home</div>
            </div>
            <div className="flex flex-col items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 10H23" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-[9px] text-zinc-500 mt-1">Tickets</div>
            </div>
            <div className="flex flex-col items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-[9px] text-zinc-500 mt-1">Favorites</div>
            </div>
            <div className="flex flex-col items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9H9.01" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 9H15.01" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-[9px] text-zinc-500 mt-1">Account</div>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Phone shadow */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/20 blur-lg rounded-full z-10"></div>
    </motion.div>
  );
};

export default PhoneMockup;
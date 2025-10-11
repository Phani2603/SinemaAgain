export default function MoviesLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="w-full h-48 md:h-64 bg-black/10 dark:bg-white/5 rounded-2xl mb-8 animate-pulse" />
      
      {/* Genre Filter Skeleton */}
      <div className="mb-12">
        <div className="w-40 h-7 bg-black/10 dark:bg-white/5 rounded mb-4 animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {Array(10).fill(0).map((_, i) => (
            <div 
              key={i} 
              className="w-20 h-8 bg-black/10 dark:bg-white/5 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
      
      {/* Movie Sections Skeletons */}
      {Array(3).fill(0).map((_, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <div className="w-48 h-8 bg-black/10 dark:bg-white/5 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array(10).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="bg-black/10 dark:bg-white/5 rounded-xl animate-pulse"
                style={{
                  animationDelay: `${(i + sectionIndex * 10) * 0.05}s`,
                }}
              >
                <div className="aspect-[2/3]" />
                <div className="p-4">
                  <div className="w-full h-5 bg-black/10 dark:bg-white/5 rounded mb-2" />
                  <div className="w-1/3 h-4 bg-black/10 dark:bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
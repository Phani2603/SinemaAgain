export default function SearchLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Search Header Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="w-64 h-8 bg-black/10 dark:bg-white/5 rounded animate-pulse" />
        <div className="w-40 h-5 bg-black/10 dark:bg-white/5 rounded animate-pulse" />
        <div className="w-64 h-10 bg-black/10 dark:bg-white/5 rounded animate-pulse" />
      </div>
      
      {/* Results Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="bg-black/10 dark:bg-white/5 rounded-xl animate-pulse"
            style={{
              animationDelay: `${i * 0.05}s`,
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
  );
}
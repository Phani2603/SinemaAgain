export default function MovieLoading() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Skeleton for hero section */}
      <div className="w-full h-[60vh] bg-black/10 dark:bg-white/5 rounded-xl mb-8 animate-pulse" />
      
      {/* Skeleton for movie details */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-12">
          {/* Overview */}
          <div>
            <div className="w-40 h-8 bg-black/10 dark:bg-white/5 rounded mb-4 animate-pulse" />
            <div className="w-full h-24 bg-black/10 dark:bg-white/5 rounded animate-pulse" />
          </div>
          
          {/* Trailer */}
          <div>
            <div className="w-40 h-8 bg-black/10 dark:bg-white/5 rounded mb-4 animate-pulse" />
            <div className="w-full aspect-video bg-black/10 dark:bg-white/5 rounded animate-pulse" />
          </div>
          
          {/* Cast */}
          <div>
            <div className="w-40 h-8 bg-black/10 dark:bg-white/5 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-full aspect-square bg-black/10 dark:bg-white/5 rounded-full mb-2 animate-pulse" />
                  <div className="w-16 h-4 mx-auto bg-black/10 dark:bg-white/5 rounded animate-pulse mb-1" />
                  <div className="w-12 h-3 mx-auto bg-black/10 dark:bg-white/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          <div className="w-full h-96 bg-black/10 dark:bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
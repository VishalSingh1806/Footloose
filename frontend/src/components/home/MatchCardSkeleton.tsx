function MatchCardSkeleton() {
  return (
    <div className="px-4 py-8 animate-pulse">
      {/* Card skeleton */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-gray-200 relative">
          {/* Photo indicators */}
          <div className="absolute top-4 left-0 right-0 flex gap-2 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-1 rounded-full bg-white/30" />
            ))}
          </div>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-300 to-transparent" />

          {/* Text placeholders */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-baseline gap-2 mb-3">
              <div className="h-8 w-32 bg-white/40 rounded" />
              <div className="h-6 w-12 bg-white/40 rounded" />
            </div>
            <div className="h-4 w-48 bg-white/40 rounded mb-3" />
            <div className="h-4 w-full bg-white/40 rounded mb-2" />
            <div className="h-4 w-3/4 bg-white/40 rounded" />
          </div>
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="w-14 h-14 bg-gray-200 rounded-full" />
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default MatchCardSkeleton;

function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-[400px] bg-[#E5E7EB]">
        {/* Top badges placeholder */}
        <div className="absolute top-4 left-4 w-7 h-7 bg-white/30 rounded-full" />
        <div className="absolute top-4 right-4 w-12 h-7 bg-white/30 rounded-full" />

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-gray-300 to-transparent" />

        {/* Bottom overlay content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="h-6 w-32 bg-white/40 rounded mb-2" />
          <div className="h-4 w-48 bg-white/40 rounded" />
        </div>
      </div>

      {/* Quick Info Skeleton */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-12 bg-[#E5E7EB] rounded" />
          <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
          <div className="h-4 w-16 bg-[#E5E7EB] rounded" />
          <div className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
          <div className="h-4 w-24 bg-[#E5E7EB] rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full bg-[#E5E7EB] rounded" />
          <div className="h-4 w-3/4 bg-[#E5E7EB] rounded" />
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="border-t border-[#F3F4F6] bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="flex-[3] h-12 bg-[#E5E7EB] rounded-xl" />
          <div className="flex-[4] h-[52px] bg-[#E5E7EB] rounded-xl" />
          <div className="flex-[3] h-12 bg-[#E5E7EB] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default MatchCardSkeleton;

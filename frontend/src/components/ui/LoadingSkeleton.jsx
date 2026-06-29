export function CardSkeleton({ className = '' }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: '#fff', border: '1.5px solid #E8E2D8', boxShadow: '0 2px 8px rgba(28,26,24,0.06)' }}>
      <div className="aspect-[2/3] shimmer" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 shimmer rounded-lg w-4/5" />
        <div className="h-2.5 shimmer rounded-lg w-1/2" />
        <div className="flex gap-1.5 mt-3">
          <div className="h-5 shimmer rounded-full w-14" />
          <div className="h-5 shimmer rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export function CardSkeletonRow({ count = 6 }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ minWidth: '200px', flex: '0 0 200px' }}>
          <CardSkeleton />
        </div>
      ))}
    </div>
  )
}

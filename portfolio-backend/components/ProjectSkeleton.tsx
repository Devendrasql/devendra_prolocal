// components/ProjectSkeleton.tsx

export default function ProjectSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border overflow-hidden animate-pulse"
        >
          <div className="aspect-[16/10] bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="flex gap-2">
              <div className="h-5 w-12 bg-muted rounded" />
              <div className="h-5 w-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

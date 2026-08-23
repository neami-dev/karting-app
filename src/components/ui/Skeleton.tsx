import { cx } from "@/lib/format";

/**
 * Loading placeholders sized to the content they replace, so nothing shifts when
 * real data arrives.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden bg-canvas-elevated",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-gradient-to-r after:from-transparent after:via-white/6 after:to-transparent",
        "after:animate-[shimmer_1.6s_infinite]",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function SlotGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-xxs sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-xs" aria-hidden="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-hairline">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="flex flex-col gap-xxs p-sm">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

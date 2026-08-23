import { Skeleton } from "@/components/ui/Skeleton";

/** Route-level fallback sized like a page hero, so nothing jumps on load. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <div className="border-b border-hairline">
        <div className="editorial py-xl">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-sm h-14 w-full max-w-2xl" />
          <Skeleton className="mt-xs h-4 w-full max-w-[32rem]" />
          <Skeleton className="mt-xs h-4 w-3/4 max-w-[28rem]" />
          <div className="mt-lg flex gap-xxs">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
      <div className="editorial py-xl">
        <div className="grid gap-xs sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-hairline">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="flex flex-col gap-xxs p-sm">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

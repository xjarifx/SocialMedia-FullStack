interface LoadingSkeletonProps {
  count?: number;
  variant?: "post" | "user" | "notification";
}

export function LoadingSkeleton({
  count = 3,
  variant = "post",
}: LoadingSkeletonProps) {
  if (variant === "post") {
    return (
      <div className="space-y-0">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="border border-white/15 bg-black p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-3 w-24 animate-pulse rounded-lg bg-white/10" />
                  <div className="h-3 w-16 animate-pulse rounded-lg bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded-lg bg-white/10" />
                  <div className="h-3 w-4/5 animate-pulse rounded-lg bg-white/10" />
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-16 animate-pulse rounded-xl bg-white/10" />
                  <div className="h-7 w-16 animate-pulse rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "user") {
    return (
      <div>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="border-b border-white/15 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/15" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "notification") {
    return (
      <div>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="border-b border-white/15 bg-white/5 p-5">
            <div className="space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/15" />
              <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

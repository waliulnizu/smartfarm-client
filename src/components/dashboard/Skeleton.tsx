const shimmer = "animate-pulse bg-zinc-200 rounded";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`${shimmer} ${className}`} />;
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-100">
      <td className="py-3 pr-4"><SkeletonBlock className="h-4 w-16" /></td>
      <td className="py-3 pr-4"><SkeletonBlock className="h-4 w-20" /></td>
      <td className="py-3 pr-4"><SkeletonBlock className="h-4 w-24" /></td>
      <td className="py-3 pr-4"><SkeletonBlock className="h-4 w-14" /></td>
      <td className="py-3 pr-4"><SkeletonBlock className="h-4 w-14" /></td>
      <td className="py-3"><SkeletonBlock className="h-5 w-16 rounded-full" /></td>
    </tr>
  );
}

export function SkeletonTable({ rows = 3 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <th key={i} className="pb-2 pr-4">
                <SkeletonBlock className="h-3 w-12" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}>
      <SkeletonBlock className="mb-4 h-5 w-40" />
      <SkeletonBlock className="mb-2 h-10 w-full" />
      <div className="mt-4 grid grid-cols-2 gap-4">
        <SkeletonBlock className="h-16 w-full" />
        <SkeletonBlock className="h-16 w-full" />
        <SkeletonBlock className="h-16 w-full" />
        <SkeletonBlock className="h-16 w-full" />
      </div>
    </div>
  );
}

import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />

          <Skeleton className="mt-4 h-8 w-32" />

          <Skeleton className="mt-3 h-3 w-36" />
        </div>

        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}
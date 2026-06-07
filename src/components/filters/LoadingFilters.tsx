import { Skeleton } from "@/components/ui/skeleton";

export const LoadingFilters = () => {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>
    </div>
  );
};
import { Skeleton } from '@/shared/ui'

export function CursoDetalleSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Cargando información del curso">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header Card Skeleton */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start sm:items-center gap-4">
          <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 pt-2 sm:pt-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>
      </div>

      {/* Tabs Placeholder Skeleton */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

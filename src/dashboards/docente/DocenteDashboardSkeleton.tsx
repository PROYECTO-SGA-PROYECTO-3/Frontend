import { Skeleton } from '@/shared/ui/Skeleton'

export function DocenteDashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Columna Principal */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Banner Bienvenida Skeleton */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-xl space-y-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-10 w-36 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Clases Hoy Skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Seguimiento Skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-44" />
          </div>
          <div className="divide-y divide-slate-100 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 pt-3 first:pt-0">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-5 h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Columna Lateral */}
      <div className="flex flex-col gap-6">
        {/* Cierre Periodo Skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-3.5 w-32" />
          <div className="my-6 flex justify-center">
            <Skeleton className="h-28 w-28 rounded-full" />
          </div>
          <Skeleton className="mx-auto h-4 w-28" />
          <Skeleton className="mt-5 h-14 w-full rounded-xl" />
        </div>

        {/* Próximos Eventos Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 p-4">
            <Skeleton className="mx-auto h-4 w-36" />
          </div>
        </div>
      </div>
    </div>
  )
}

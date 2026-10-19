import { Skeleton } from '@/shared/ui/Skeleton'

export function InstitucionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Encabezado de la sección */}
      <div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-7 w-64 rounded-lg" />
        </div>
        <Skeleton className="mt-2 h-4 w-96 rounded-md" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Ficha Institucional Skeleton */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          {/* Header de la ficha */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-5">
            <div className="flex items-start gap-3.5">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3.5 w-72 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>

          {/* Razón social banner */}
          <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50/80 p-4 sm:p-5 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </div>

          {/* Definition List Skeleton con divisores */}
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-slate-100 pt-3.5 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
            {/* Fila dirección completa */}
            <div className="border-t border-slate-100 pt-3.5 sm:col-span-2 space-y-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Panel de Multimedia Skeleton */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 space-y-1.5">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

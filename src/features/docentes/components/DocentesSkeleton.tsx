import { Skeleton } from '@/shared/ui'

interface DocentesSkeletonProps {
  cantidadFilas?: number
}

export function DocentesSkeleton({ cantidadFilas = 5 }: DocentesSkeletonProps) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Cargando información docente">
      {/* Esqueleto de métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-skel-${i}`}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Esqueleto de la barra de herramientas */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      {/* Esqueleto de la tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="border-b border-slate-200 bg-slate-50/50 p-4">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="divide-y divide-slate-100 p-2">
          {Array.from({ length: cantidadFilas }).map((_, i) => (
            <div key={`row-skel-${i}`} className="flex items-center justify-between gap-4 p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-5 w-28 hidden md:block" />
              <Skeleton className="h-5 w-20 hidden lg:block" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

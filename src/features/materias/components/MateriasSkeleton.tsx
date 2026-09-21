import { Skeleton } from '@/shared/ui/Skeleton'

interface MateriasSkeletonProps {
  filas?: number
  cantidad?: number
}

export function MateriasSkeleton({ filas, cantidad = 6 }: MateriasSkeletonProps) {
  const totalFilas = filas ?? cantidad
  return (
    <div
      role="status"
      aria-label="Cargando materias"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: totalFilas }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 px-6 py-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-4 w-6 text-center" />
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

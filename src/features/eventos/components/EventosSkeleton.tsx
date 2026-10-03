import { Skeleton } from '@/shared/ui'

export function EventosSkeleton({ cantidad = 5 }: { cantidad?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-label="Cargando eventos..." aria-busy="true">
      {Array.from({ length: cantidad }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
        >
          {/* Esqueleto Fecha */}
          <Skeleton className="h-16 w-14 shrink-0 rounded-xl" />

          {/* Esqueleto Contenido */}
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-5 w-2/5 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <div className="pt-1">
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
          </div>

          {/* Esqueleto Botón de acción */}
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

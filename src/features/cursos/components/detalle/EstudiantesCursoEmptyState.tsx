import { Users, SearchX, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/ui'

export interface EstudiantesCursoEmptyStateProps {
  esPorBusqueda?: boolean
  terminoBusqueda?: string
  onLimpiarBusqueda?: () => void
}

export function EstudiantesCursoEmptyState({
  esPorBusqueda = false,
  terminoBusqueda,
  onLimpiarBusqueda,
}: EstudiantesCursoEmptyStateProps) {
  if (esPorBusqueda) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <SearchX size={24} aria-hidden="true" />
        </div>
        <h4 className="text-base font-bold text-slate-800">
          No se encontraron coincidencias
        </h4>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No hay estudiantes matriculados que coincidan con &ldquo;{terminoBusqueda}&rdquo;. Intenta con otro nombre o documento.
        </p>
        {onLimpiarBusqueda && (
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={onLimpiarBusqueda}
              className="w-auto px-3.5 py-1.5 text-xs"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Limpiar búsqueda</span>
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center"
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users size={28} aria-hidden="true" />
      </div>
      <h4 className="text-base font-bold text-slate-900">
        Sin estudiantes matriculados
      </h4>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        Este curso no cuenta con alumnos matriculados para el año lectivo en vigencia. Una vez registradas las inscripciones institucionales, aparecerán listados en este panel.
      </p>
    </div>
  )
}

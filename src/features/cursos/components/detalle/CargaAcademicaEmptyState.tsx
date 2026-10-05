import { BookOpen, SearchX, RotateCcw, Plus } from 'lucide-react'
import { Button } from '@/shared/ui'

export interface CargaAcademicaEmptyStateProps {
  esPorBusqueda?: boolean
  terminoBusqueda?: string
  onLimpiarBusqueda?: () => void
  onAsignarMateria?: () => void
}

export function CargaAcademicaEmptyState({
  esPorBusqueda = false,
  terminoBusqueda,
  onLimpiarBusqueda,
  onAsignarMateria,
}: CargaAcademicaEmptyStateProps) {
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
          No se encontraron asignaturas
        </h4>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No hay asignaciones que coincidan con &ldquo;{terminoBusqueda}&rdquo;. Intenta buscando por otro nombre de materia o docente.
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
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <BookOpen size={28} aria-hidden="true" />
      </div>
      <h4 className="text-base font-bold text-slate-900">
        Sin materias asignadas
      </h4>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        Este curso aún no tiene materias ni docentes titulares asignados en el año lectivo en curso. Comienza registrando la primera materia para conformar la carga académica del grupo.
      </p>
      {onAsignarMateria && (
        <div className="mt-5">
          <Button
            type="button"
            onClick={onAsignarMateria}
            className="w-auto px-4 py-2 text-xs font-semibold"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Asignar primera materia</span>
          </Button>
        </div>
      )}
    </div>
  )
}

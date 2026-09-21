import { Plus, RotateCcw, SearchX, Users } from 'lucide-react'
import { Button } from '@/shared/ui'

interface DocentesEmptyStateProps {
  esBusqueda: boolean
  terminoBusqueda?: string
  onCrear: () => void
  onLimpiarFiltros?: () => void
}

export function DocentesEmptyState({
  esBusqueda,
  terminoBusqueda,
  onCrear,
  onLimpiarFiltros,
}: DocentesEmptyStateProps) {
  if (esBusqueda) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <SearchX size={28} />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          No se encontraron resultados
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">
          {terminoBusqueda
            ? `No encontramos coincidencias para "${terminoBusqueda}". Intenta con otros términos o verifica los filtros.`
            : 'No hay docentes que coincidan con los filtros seleccionados.'}
        </p>
        {onLimpiarFiltros && (
          <div className="mt-5">
            <Button variant="secondary" onClick={onLimpiarFiltros}>
              <RotateCcw size={16} />
              Restablecer filtros
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
        <Users size={32} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">
        Planta docente sin registros
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-500">
        Aún no se ha dado de alta ningún profesor en el sistema. Registra a los docentes
        para que puedan gestionar asignaturas, horarios y calificaciones.
      </p>
      <div className="mt-6">
        <Button onClick={onCrear}>
          <Plus size={18} />
          Registrar Primer Docente
        </Button>
      </div>
    </div>
  )
}

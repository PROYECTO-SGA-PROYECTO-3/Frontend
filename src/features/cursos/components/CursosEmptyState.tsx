import { SearchX, School, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/ui'

interface CursosEmptyStateProps {
  esBusqueda: boolean
  onLimpiarFiltros?: () => void
  onNuevoCurso?: () => void
}

export function CursosEmptyState({
  esBusqueda,
  onLimpiarFiltros,
  onNuevoCurso,
}: CursosEmptyStateProps) {
  if (esBusqueda) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <SearchX size={28} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Sin coincidencias en la búsqueda
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          No se encontraron cursos que coincidan con el término o filtro seleccionado.
        </p>
        {onLimpiarFiltros && (
          <div className="mt-5 w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={onLimpiarFiltros}
              className="w-auto"
            >
              <RotateCcw size={16} aria-hidden="true" />
              <span>Limpiar filtros</span>
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <School size={28} aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">
        Catálogo de cursos vacío
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Aún no se han configurado grados o cursos escolares en la institución educativa.
      </p>
      {onNuevoCurso && (
        <div className="mt-5 w-auto">
          <Button
            type="button"
            variant="primary"
            onClick={onNuevoCurso}
            className="w-auto"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Registrar primer grado</span>
          </Button>
        </div>
      )}
    </div>
  )
}

import { Plus, School } from 'lucide-react'
import { SearchInput, Button } from '@/shared/ui'
import type { CriterioOrdenCurso, FiltrosCurso } from '../types'

interface CursosToolbarProps {
  busqueda: string
  onBusquedaChange: (valor: string) => void
  estadoDirector: NonNullable<FiltrosCurso['estadoDirector']>
  onEstadoDirectorChange: (estado: NonNullable<FiltrosCurso['estadoDirector']>) => void
  orden: CriterioOrdenCurso
  onOrdenChange: (orden: CriterioOrdenCurso) => void
  totalCursos: number
  totalFiltrados: number
  onNuevoCurso: () => void
}

export function CursosToolbar({
  busqueda,
  onBusquedaChange,
  estadoDirector,
  onEstadoDirectorChange,
  orden,
  onOrdenChange,
  totalCursos,
  totalFiltrados,
  onNuevoCurso,
}: CursosToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Fila superior: Buscador + Botón de Creación */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={busqueda}
            onChange={onBusquedaChange}
            placeholder="Buscar por curso o nombre de director..."
            aria-label="Buscar grados o cursos"
          />
        </div>

        <div className="w-full sm:w-auto">
          <Button
            type="button"
            variant="primary"
            onClick={onNuevoCurso}
            className="w-full sm:w-auto"
            aria-label="Registrar un nuevo curso o grado escolar"
          >
            <Plus size={18} aria-hidden="true" />
            <span>Nuevo Grado</span>
          </Button>
        </div>
      </div>

      {/* Fila inferior: Filtros de estado + Selector de Orden */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
        {/* Píldoras de filtro */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por asignación de director">
          <span className="mr-1 text-slate-400 font-medium">Estado:</span>
          {(
            [
              { valor: 'TODOS', etiqueta: 'Todos' },
              { valor: 'CON_DIRECTOR', etiqueta: 'Con Director' },
              { valor: 'SIN_DIRECTOR', etiqueta: 'Sin Director' },
            ] as const
          ).map(({ valor, etiqueta }) => {
            const activo = estadoDirector === valor
            return (
              <button
                key={valor}
                type="button"
                onClick={() => onEstadoDirectorChange(valor)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 font-medium transition ${
                  activo
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {etiqueta}
              </button>
            )
          })}
        </div>

        {/* Ordenamiento e Indicador de Resultados */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <label htmlFor="orden-cursos-select" className="text-slate-400 font-medium">
              Orden:
            </label>
            <select
              id="orden-cursos-select"
              value={orden}
              onChange={(e) => onOrdenChange(e.target.value as CriterioOrdenCurso)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            >
              <option value="nombre-asc">Nombre (A - Z)</option>
              <option value="nombre-desc">Nombre (Z - A)</option>
              <option value="id-asc">Más antiguos</option>
              <option value="id-desc">Más recientes</option>
            </select>
          </div>

          <div className="hidden items-center gap-1 text-slate-400 sm:flex">
            <School size={14} aria-hidden="true" />
            <span>
              {totalFiltrados === totalCursos
                ? `${totalCursos} grados`
                : `${totalFiltrados} de ${totalCursos} grados`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Search, UserPlus, X } from 'lucide-react'
import { Button } from '@/shared/ui'
import type { Grado } from '@/shared/types/academico.types'
import type { FiltroEstadoEstudiante } from '../types'

interface EstudiantesToolbarProps {
  busqueda: string
  filtroEstado: FiltroEstadoEstudiante
  filtroGrado: number | ''
  grados: Grado[]
  cargandoGrados?: boolean
  hayFiltros: boolean
  onCambioBusqueda: (valor: string) => void
  onCambioEstado: (valor: FiltroEstadoEstudiante) => void
  onCambioGrado: (valor: number | '') => void
  onLimpiarFiltros: () => void
  onCrear: () => void
}

export function EstudiantesToolbar({
  busqueda,
  filtroEstado,
  filtroGrado,
  grados,
  cargandoGrados = false,
  hayFiltros,
  onCambioBusqueda,
  onCambioEstado,
  onCambioGrado,
  onLimpiarFiltros,
  onCrear,
}: EstudiantesToolbarProps) {
  return (
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Zona de búsqueda y filtros reactivos */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Buscador reactivo */}
        <div className="relative min-w-65 flex-1 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onCambioBusqueda(e.target.value)}
            placeholder="Buscar por nombre o documento..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => onCambioBusqueda('')}
              aria-label="Limpiar búsqueda"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filtro por Grado Académico */}
        <div className="flex items-center">
          <select
            value={filtroGrado}
            onChange={(e) => onCambioGrado(e.target.value ? Number(e.target.value) : '')}
            disabled={cargandoGrados}
            aria-label="Filtrar por grado académico"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer disabled:opacity-50"
          >
            <option value="">Todos los grados</option>
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div className="flex items-center">
          <select
            value={filtroEstado}
            onChange={(e) => onCambioEstado(e.target.value as FiltroEstadoEstudiante)}
            aria-label="Filtrar por estado del estudiante"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
          </select>
        </div>

        {/* Botón para restablecer filtros cuando hay alguno activo */}
        {hayFiltros && (
          <button
            type="button"
            onClick={onLimpiarFiltros}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition cursor-pointer px-2 py-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <X size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Botón de acción principal: Crear estudiante */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <Button onClick={onCrear}>
          <UserPlus size={16} />
          Nuevo Estudiante
        </Button>
      </div>
    </header>
  )
}

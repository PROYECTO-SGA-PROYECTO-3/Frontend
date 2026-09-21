import { Plus, Search, X, ArrowDownAZ, ArrowUpZA, Clock } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import type { CriterioOrdenMateria } from '../types'

interface MateriasToolbarProps {
  busqueda: string
  orden: CriterioOrdenMateria
  onCambioBusqueda: (valor: string) => void
  onCambioOrden: (orden: CriterioOrdenMateria) => void
  onCrear: () => void
}

export function MateriasToolbar({
  busqueda,
  orden,
  onCambioBusqueda,
  onCambioOrden,
  onCrear,
}: MateriasToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Barra de búsqueda */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onCambioBusqueda(e.target.value)}
          placeholder="Buscar asignatura por nombre..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-600/20"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => onCambioBusqueda('')}
            aria-label="Borrar búsqueda"
            className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Selector de ordenamiento y Botón Crear */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative">
          <select
            value={orden}
            onChange={(e) => onCambioOrden(e.target.value as CriterioOrdenMateria)}
            aria-label="Criterio de ordenación"
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-8 pl-3 text-xs font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          >
            <option value="alfabetico-asc">A - Z (Alfabético)</option>
            <option value="alfabetico-desc">Z - A (Alfabético)</option>
            <option value="recientes">Más recientes</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
            {orden === 'alfabetico-asc' && <ArrowDownAZ size={14} />}
            {orden === 'alfabetico-desc' && <ArrowUpZA size={14} />}
            {orden === 'recientes' && <Clock size={14} />}
          </span>
        </div>

        <div className="w-auto">
          <Button variant="primary" onClick={onCrear}>
            <Plus size={18} />
            <span>Nueva Materia</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

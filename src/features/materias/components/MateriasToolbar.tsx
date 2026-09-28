import { Plus, ArrowDownAZ, ArrowUpZA, Clock } from 'lucide-react'
import { Button, SearchInput } from '@/shared/ui'
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
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Barra de búsqueda */}
      <SearchInput
        value={busqueda}
        onChange={onCambioBusqueda}
        placeholder="Buscar asignatura por nombre..."
        containerClassName="flex-1"
      />

      {/* Selector de ordenamiento y Botón Crear */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative">
          <select
            value={orden}
            onChange={(e) => onCambioOrden(e.target.value as CriterioOrdenMateria)}
            aria-label="Criterio de ordenación"
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-8 pl-3 text-xs font-semibold text-slate-700 outline-none transition-all hover:bg-slate-100 hover:border-slate-300 focus:border-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-700/15"
          >
            <option value="alfabetico-asc">A - Z (Alfabético)</option>
            <option value="alfabetico-desc">Z - A (Alfabético)</option>
            <option value="recientes">Más recientes</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
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

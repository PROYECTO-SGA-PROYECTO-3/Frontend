import { Plus, X } from 'lucide-react'
import { Button, SearchInput } from '@/shared/ui'
import type { FiltroEstadoDocente, FiltroFirmaDocente, OrdenDocente } from '../types'

interface DocentesToolbarProps {
  busqueda: string
  filtroEstado: FiltroEstadoDocente
  filtroFirma: FiltroFirmaDocente
  orden: OrdenDocente
  onCambioBusqueda: (valor: string) => void
  onCambioEstado: (valor: FiltroEstadoDocente) => void
  onCambioFirma: (valor: FiltroFirmaDocente) => void
  onCambioOrden: (valor: OrdenDocente) => void
  onCrear: () => void
  onLimpiarFiltros?: () => void
  hayFiltros?: boolean
}

export function DocentesToolbar({
  busqueda,
  filtroEstado,
  filtroFirma,
  orden,
  onCambioBusqueda,
  onCambioEstado,
  onCambioFirma,
  onCambioOrden,
  onCrear,
  onLimpiarFiltros,
  hayFiltros = false,
}: DocentesToolbarProps) {
  return (
    <header className="flex flex-col gap-3">
      {/* Nivel 1: Búsqueda y Botón de Acción Principal */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={busqueda}
          onChange={onCambioBusqueda}
          placeholder="Buscar por nombre, documento, correo o materia..."
          containerClassName="w-full sm:w-80 lg:w-96"
        />

        <div className="w-full sm:w-auto shrink-0">
          <Button onClick={onCrear} className="w-full sm:w-auto">
            <Plus size={18} />
            Registrar Nuevo Docente
          </Button>
        </div>
      </div>

      {/* Nivel 2: Filtros de Dominio y Ordenamiento */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Filtro por estado */}
        <div className="flex items-center">
          <select
            value={filtroEstado}
            onChange={(e) => onCambioEstado(e.target.value as FiltroEstadoDocente)}
            aria-label="Filtrar por estado del docente"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVOS">Solo Activos</option>
            <option value="INACTIVOS">Solo Inactivos</option>
          </select>
        </div>

        {/* Filtro por firma */}
        <div className="flex items-center">
          <select
            value={filtroFirma}
            onChange={(e) => onCambioFirma(e.target.value as FiltroFirmaDocente)}
            aria-label="Filtrar por estado de la firma"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="TODOS">Todas las firmas</option>
            <option value="CON_FIRMA">Con firma registrada</option>
            <option value="SIN_FIRMA">Sin firma registrada</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="flex items-center">
          <select
            value={orden}
            onChange={(e) => onCambioOrden(e.target.value as OrdenDocente)}
            aria-label="Ordenar listado"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 cursor-pointer"
          >
            <option value="NOMBRE_ASC">Nombre (A - Z)</option>
            <option value="NOMBRE_DESC">Nombre (Z - A)</option>
            <option value="DOCUMENTO_ASC">Identificación (Menor a Mayor)</option>
          </select>
        </div>

        {/* Limpiar filtros si hay alguno activo */}
        {hayFiltros && onLimpiarFiltros && (
          <button
            type="button"
            onClick={onLimpiarFiltros}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
          >
            <X size={14} />
            Restablecer
          </button>
        )}
      </div>
    </header>
  )
}

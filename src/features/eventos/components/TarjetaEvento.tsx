import { MapPin, Trash2 } from 'lucide-react'
import { Can } from '@/features/auth'
import { formatearFechaCorta } from '@/shared/lib/utils'
import type { EventoInstitucional } from '../types'

export interface TarjetaEventoProps {
  evento: EventoInstitucional
  puedeEliminar?: boolean
  onEliminar?: (evento: EventoInstitucional) => void
}

export function TarjetaEvento({
  evento,
  puedeEliminar = false,
  onEliminar,
}: TarjetaEventoProps) {
  const { dia, mes } = formatearFechaCorta(evento.fecha)

  return (
    <article className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      {/* Contenedor de Fecha */}
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 py-2.5 text-brand-700 ring-1 ring-brand-700/10 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <span className="text-2xl font-bold leading-none">{dia}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-wider">{mes}</span>
      </div>

      {/* Detalle del Evento */}
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-brand-900 break-words">
          {evento.titulo}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 break-words whitespace-pre-line">
          {evento.descripcion}
        </p>

        {evento.lugar && (
          <div className="mt-3 flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              <MapPin size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
              <span>{evento.lugar}</span>
            </span>
          </div>
        )}
      </div>

      {/* Botón de eliminación exclusivo para Administradores con autorización declarativa */}
      {puedeEliminar && onEliminar && (
        <Can roles={['ADMIN']}>
          <div className="shrink-0 pt-0.5">
            <button
              type="button"
              onClick={() => onEliminar(evento)}
              aria-label={`Eliminar evento: ${evento.titulo}`}
              title="Eliminar evento"
              className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>
        </Can>
      )}
    </article>
  )
}

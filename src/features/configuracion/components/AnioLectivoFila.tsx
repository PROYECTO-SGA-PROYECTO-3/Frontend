import { Layers, Check } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import type { AnioLectivo } from '../types'

interface AnioLectivoFilaProps {
  anio: AnioLectivo
  onGestionarPeriodos: (anio: AnioLectivo) => void
  onActivarAnio: (anio: AnioLectivo) => void
}

export function AnioLectivoFila({
  anio,
  onGestionarPeriodos,
  onActivarAnio,
}: AnioLectivoFilaProps) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/50">
      <div className="flex items-center gap-3">
        <span className="text-base font-bold text-slate-900">{anio.anio}</span>
        <Badge color={anio.activo ? 'brand' : 'slate'}>
          {anio.activo ? 'Año Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onGestionarPeriodos(anio)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Layers size={14} className="text-slate-500" />
          Gestionar periodos
        </button>

        {!anio.activo && (
          <button
            type="button"
            onClick={() => onActivarAnio(anio)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 hover:text-brand-800"
          >
            <Check size={14} />
            Activar año
          </button>
        )}
      </div>
    </div>
  )
}

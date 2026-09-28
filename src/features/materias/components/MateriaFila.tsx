import { BookMarked, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import type { Asignatura } from '../types'

interface MateriaFilaProps {
  materia: Asignatura
  indice: number
  onEditar: (materia: Asignatura) => void
  onEliminar: (materia: Asignatura) => void
}

export function MateriaFila({
  materia,
  indice,
  onEditar,
  onEliminar,
}: MateriaFilaProps) {
  const codigoRef = `ASG-${String(materia.id).padStart(3, '0')}`

  return (
    <tr className="group transition-colors duration-150 hover:bg-slate-50/80">
      {/* Posición secuencial */}
      <td className="w-16 px-6 py-4 text-center font-mono text-xs font-medium text-slate-400">
        {indice + 1}
      </td>

      {/* Código de referencia en catálogo */}
      <td className="w-28 px-4 py-4">
        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-600">
          {codigoRef}
        </span>
      </td>

      {/* Nombre de la asignatura */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100/70">
            <BookMarked size={16} />
          </div>
          <span className="font-semibold text-slate-900 transition-colors group-hover:text-brand-900">
            {materia.nombre}
          </span>
        </div>
      </td>

      {/* Estado en catálogo */}
      <td className="w-32 px-4 py-4 text-center">
        <Badge color="brand">Oficial</Badge>
      </td>

      {/* Acciones de gestión */}
      <td className="w-28 px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEditar(materia)}
            aria-label={`Editar ${materia.nombre}`}
            title="Editar asignatura"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={() => onEliminar(materia)}
            aria-label={`Eliminar ${materia.nombre}`}
            title="Eliminar asignatura"
            className="cursor-pointer rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-700 focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}


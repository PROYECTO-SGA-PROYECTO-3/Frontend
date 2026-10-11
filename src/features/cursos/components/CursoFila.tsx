import { Link } from 'react-router-dom'
import { School, UserCheck, UserX, Pencil, Trash2, ChevronRight } from 'lucide-react'
import type { Grado } from '@/shared/types/academico.types'

interface CursoFilaProps {
  curso: Grado
  indice: number
  onEditar: (curso: Grado) => void
  onEliminar: (curso: Grado) => void
}

export function CursoFila({ curso, indice, onEditar, onEliminar }: CursoFilaProps) {
  const tieneDirector = Boolean(curso.directorId && curso.nombreDirector)

  return (
    <tr className="group transition-colors hover:bg-slate-50/80">
      {/* Columna: Índice correlativo */}
      <td className="w-12 py-3.5 pl-4 pr-2 text-center text-xs font-semibold text-slate-400 sm:pl-6">
        {indice}
      </td>

      {/* Columna: Nombre del Grado / Curso */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100/80">
            <School size={18} aria-hidden="true" />
          </div>
          <div>
            <Link
              to={`/admin/cursos/${curso.id}`}
              className="font-semibold text-slate-900 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600 rounded"
            >
              {curso.nombre}
            </Link>
            <p className="text-xs text-slate-400">ID #{curso.id}</p>
          </div>
        </div>
      </td>

      {/* Columna: Director de Grupo */}
      <td className="py-3.5 px-3">
        {tieneDirector ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/70 px-3 py-1 text-xs font-medium text-brand-800">
            <UserCheck size={14} className="text-brand-600 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-50 sm:max-w-xs">{curso.nombreDirector}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
            <UserX size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
            <span>Sin director asignado</span>
          </div>
        )}
      </td>

      {/* Columna: Acciones Rápidas */}
      <td className="py-3.5 pl-3 pr-4 text-right sm:pr-6">
        <div className="flex items-center justify-end gap-1">
          {/* Botón Ver Detalle (preparado para PR 3) */}
          <Link
            to={`/admin/cursos/${curso.id}`}
            title={`Ver detalle de ${curso.nombre}`}
            aria-label={`Ver detalle y contenido de ${curso.nombre}`}
            className="cursor-pointer inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span>Detalle</span>
            <ChevronRight size={14} aria-hidden="true" />
          </Link>

          {/* Botón Editar */}
          <button
            type="button"
            onClick={() => onEditar(curso)}
            title={`Editar ${curso.nombre}`}
            aria-label={`Editar ${curso.nombre}`}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Pencil size={16} aria-hidden="true" />
          </button>

          {/* Botón Eliminar */}
          <button
            type="button"
            onClick={() => onEliminar(curso)}
            title={`Eliminar ${curso.nombre}`}
            aria-label={`Eliminar ${curso.nombre}`}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  )
}

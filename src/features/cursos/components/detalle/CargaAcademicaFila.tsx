import { memo } from 'react'
import { BookOpen, UserRoundPen, Trash2 } from 'lucide-react'
import type { CargaAcademica } from '@/shared/types/academico.types'

import { Avatar, Badge } from '@/shared/ui'

export interface CargaAcademicaFilaProps {
  carga: CargaAcademica
  indice: number
  onReasignarDocente?: (carga: CargaAcademica) => void
  onRemoverMateria?: (carga: CargaAcademica) => void
}

export const CargaAcademicaFila = memo(function CargaAcademicaFila({
  carga,
  indice,
  onReasignarDocente,
  onRemoverMateria,
}: CargaAcademicaFilaProps) {
  const handleReasignar = () => {
    onReasignarDocente?.(carga)
  }

  const handleRemover = () => {
    onRemoverMateria?.(carga)
  }

  return (
    <tr className="group transition-colors hover:bg-slate-50/80">
      {/* Columna: Índice correlativo */}
      <td className="w-12 py-3.5 pl-4 pr-2 text-center text-xs font-semibold text-slate-400 sm:pl-6">
        {indice}
      </td>

      {/* Columna: Asignatura (Icono + Nombre + ID) */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100/80">
            <BookOpen size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
              {carga.nombreAsignatura}
            </p>
            <p className="text-xs text-slate-400">
              ID Materia #{carga.asignaturaId}
            </p>
          </div>
        </div>
      </td>

      {/* Columna: Docente Titular (Avatar + Nombre + Documento) */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <Avatar
            nombre={carga.nombreDocente}
            tamano="sm"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800">
              {carga.nombreDocente}
            </p>
            <p className="font-mono text-xs text-slate-400">
              Doc. {carga.documentoDocente}
            </p>
          </div>
        </div>
      </td>

      {/* Columna: Año Lectivo */}
      <td className="py-3.5 px-4 text-center">
        <Badge color="slate">
          {carga.anioLectivo}
        </Badge>
      </td>

      {/* Columna: Acciones */}
      <td className="py-3.5 pl-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Botón Reasignar Docente */}
          {onReasignarDocente && (
            <button
              type="button"
              onClick={handleReasignar}
              title={`Reasignar docente para ${carga.nombreAsignatura}`}
              aria-label={`Reasignar docente para ${carga.nombreAsignatura}`}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <UserRoundPen size={16} aria-hidden="true" />
            </button>

          )}

          {/* Botón Remover Materia del Curso */}
          {onRemoverMateria && (
            <button
              type="button"
              onClick={handleRemover}
              title={`Remover ${carga.nombreAsignatura} del curso`}
              aria-label={`Remover ${carga.nombreAsignatura} del curso`}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
})

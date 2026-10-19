import { Eye, Trash2, SlidersHorizontal } from 'lucide-react'
import type { Matricula, EstadoMatricula } from '@/shared/types/matricula.types'
import { Avatar, Badge, type BadgeColor } from '@/shared/ui'

export interface EstudianteMatriculadoFilaProps {
  matricula: Matricula
  indice: number
  onRetirar?: (matricula: Matricula) => void
  onCambiarEstado?: (matricula: Matricula) => void
}

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  RETIRADA: 'red',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
}

export function EstudianteMatriculadoFila({
  matricula,
  indice,
  onRetirar,
  onCambiarEstado,
}: EstudianteMatriculadoFilaProps) {
  const colorBadge = COLOR_ESTADO[matricula.estado] ?? 'slate'

  const handleRetirar = () => {
    onRetirar?.(matricula)
  }

  const handleCambiarEstado = () => {
    onCambiarEstado?.(matricula)
  }

  const estaActiva = matricula.estado === 'ACTIVA'

  return (
    <tr className="group transition-colors hover:bg-slate-50/80">
      {/* Columna: Índice correlativo */}
      <td className="w-12 py-3.5 pl-4 pr-2 text-center text-xs font-semibold text-slate-400 sm:pl-6">
        {indice}
      </td>

      {/* Columna: Estudiante (Avatar + Nombre + ID) */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <Avatar
            nombre={matricula.nombreCompletoEstudiante}
            tamano="sm"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
              {matricula.nombreCompletoEstudiante}
            </p>
            <p className="text-xs text-slate-400">
              ID Alumno #{matricula.estudianteId}
            </p>
          </div>
        </div>
      </td>

      {/* Columna: Documento de Identidad */}
      <td className="py-3.5 px-4">
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
          {matricula.documentoEstudiante}
        </span>
      </td>

      {/* Columna: Estado de Matrícula */}
      <td className="py-3.5 px-4 text-center">
        <Badge color={colorBadge}>
          {matricula.estado}
        </Badge>
      </td>

      <td className="py-3.5 pl-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Botón Ver (preparado sin funciones por ahora) */}
          <button
            type="button"
            disabled
            title={`Ver detalles de ${matricula.nombreCompletoEstudiante}`}
            aria-label={`Ver detalles de ${matricula.nombreCompletoEstudiante}`}
            className="rounded-lg p-1.5 text-slate-300 cursor-not-allowed opacity-60 transition"
          >
            <Eye size={16} aria-hidden="true" />
          </button>

          {/* Botón Cambiar Estado de Matrícula (solo permitido si está ACTIVA) */}
          {onCambiarEstado && (
            <button
              type="button"
              disabled={!estaActiva}
              onClick={handleCambiarEstado}
              title={
                estaActiva
                  ? `Cambiar estado de matrícula de ${matricula.nombreCompletoEstudiante}`
                  : `Matrícula en estado final (${matricula.estado}), no modificable`
              }
              aria-label={
                estaActiva
                  ? `Cambiar estado de matrícula de ${matricula.nombreCompletoEstudiante}`
                  : `Matrícula en estado final (${matricula.estado}), no modificable`
              }
              className={
                estaActiva
                  ? 'cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600'
                  : 'rounded-lg p-1.5 text-slate-300 cursor-not-allowed opacity-40 transition'
              }
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
            </button>
          )}

          {/* Botón Eliminar Matrícula del Curso (anulación en caso de error de digitación, solo si está ACTIVA y sin notas) */}
          {onRetirar && (
            <button
              type="button"
              disabled={!estaActiva}
              onClick={handleRetirar}
              title={
                estaActiva
                  ? `Eliminar matrícula de ${matricula.nombreCompletoEstudiante} del curso (sin calificaciones)`
                  : `No se puede eliminar una matrícula en estado ${matricula.estado}`
              }
              aria-label={
                estaActiva
                  ? `Eliminar matrícula de ${matricula.nombreCompletoEstudiante} del curso`
                  : `Matrícula en estado ${matricula.estado}, no eliminable`
              }
              className={
                estaActiva
                  ? 'cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600'
                  : 'rounded-lg p-1.5 text-slate-300 cursor-not-allowed opacity-40 transition'
              }
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}


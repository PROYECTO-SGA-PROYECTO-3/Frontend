import { Calendar } from 'lucide-react'
import type { Matricula, EstadoMatricula } from '@/shared/types/matricula.types'
import { Avatar, Badge, type BadgeColor } from '@/shared/ui'

export interface EstudianteMatriculadoFilaProps {
  matricula: Matricula
  indice: number
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
}: EstudianteMatriculadoFilaProps) {
  const colorBadge = COLOR_ESTADO[matricula.estado] ?? 'slate'

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

      {/* Columna: Año Lectivo */}
      <td className="py-3.5 px-4 text-center">
        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Calendar size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
          <span>{matricula.anioLectivo}</span>
        </span>
      </td>

      {/* Columna: Estado de Matrícula */}
      <td className="py-3.5 pl-4 pr-6 text-right">
        <Badge color={colorBadge}>
          {matricula.estado}
        </Badge>
      </td>
    </tr>
  )
}

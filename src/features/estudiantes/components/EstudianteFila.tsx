import { Eye, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
import { nombreCompleto } from '@/shared/lib/utils'
import { Avatar, Badge, type BadgeColor } from '@/shared/ui'
import type { EstadoMatricula } from '@/shared/types/matricula.types'
import type { Estudiante } from '../types'

interface EstudianteFilaProps {
  estudiante: Estudiante
  onVerPerfil: (estudiante: Estudiante) => void
  onEditar: (estudiante: Estudiante) => void
  onCambiarEstado: (estudiante: Estudiante) => void
  onEliminar: (estudiante: Estudiante) => void
}

const COLOR_ESTADO_MATRICULA: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
  RETIRADA: 'red',
}

export function EstudianteFila({
  estudiante,
  onVerPerfil,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: EstudianteFilaProps) {
  const nombre = nombreCompleto(estudiante)

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/80">
      {/* Estudiante (Avatar + Nombre completo) */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar nombre={nombre} tamano="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 leading-tight">{nombre}</p>
            <p className="truncate text-xs text-slate-400">ID #{estudiante.id}</p>
          </div>
        </div>
      </td>

      {/* Documento de Identificación */}
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
          {estudiante.documento}
        </span>
      </td>

      {/* Grado / Matrícula */}
      <td className="px-5 py-3.5">
        {estudiante.gradoActualNombre ? (
          <Badge color="blue">{estudiante.gradoActualNombre}</Badge>
        ) : estudiante.ultimaMatriculaGrado && estudiante.ultimaMatriculaEstado ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge color="slate">{estudiante.ultimaMatriculaGrado}</Badge>
            <Badge color={COLOR_ESTADO_MATRICULA[estudiante.ultimaMatriculaEstado]}>
              {estudiante.ultimaMatriculaEstado}
            </Badge>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin matricular</span>
        )}
      </td>

      {/* Estado del Usuario en la Plataforma */}
      <td className="px-5 py-3.5">
        <Badge color={estudiante.activo ? 'brand' : 'red'}>
          {estudiante.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </td>

      {/* Acciones */}
      <td className="px-5 py-3.5 text-right">
        <div className="inline-flex items-center justify-end gap-1">
          {/* Ver Perfil */}
          <button
            type="button"
            onClick={() => onVerPerfil(estudiante)}
            aria-label={`Ver perfil de ${nombre}`}
            title="Ver perfil completo"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Eye size={16} />
          </button>

          {/* Editar */}
          <button
            type="button"
            onClick={() => onEditar(estudiante)}
            aria-label={`Editar datos de ${nombre}`}
            title="Editar estudiante"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Pencil size={16} />
          </button>

          {/* Activar / Desactivar */}
          <button
            type="button"
            onClick={() => onCambiarEstado(estudiante)}
            aria-label={`${estudiante.activo ? 'Desactivar' : 'Activar'} a ${nombre}`}
            title={estudiante.activo ? 'Desactivar cuenta' : 'Activar cuenta'}
            className={`cursor-pointer rounded-lg p-1.5 transition ${
              estudiante.activo
                ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
                : 'text-brand-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {estudiante.activo ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>

          {/* Eliminar */}
          <button
            type="button"
            onClick={() => onEliminar(estudiante)}
            aria-label={`Eliminar registro de ${nombre}`}
            title="Eliminar definitivamente"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

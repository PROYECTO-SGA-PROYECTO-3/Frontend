import { CheckCircle2, Clock, Pencil, Trash2, UserCheck, UserX } from 'lucide-react'
import { nombreCompleto } from '@/shared/lib/utils'
import { Avatar, Badge, type BadgeColor } from '@/shared/ui'
import type { Docente } from '../types'

interface DocenteFilaProps {
  docente: Docente
  onEditar: (docente: Docente) => void
  onCambiarEstado: (docente: Docente) => void
  onEliminar: (docente: Docente) => void
}

const PALETA_MATERIAS: BadgeColor[] = [
  'blue',
  'accent',
  'pink',
  'purple',
  'brand',
  'cyan',
  'orange',
  'indigo',
]

function colorPorMateria(texto: string): BadgeColor {
  const hash = [...texto].reduce((acum, c) => acum + c.charCodeAt(0), 0)
  return PALETA_MATERIAS[hash % PALETA_MATERIAS.length]
}

export function DocenteFila({
  docente,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: DocenteFilaProps) {
  const nombre = nombreCompleto(docente)
  const tieneFirma = Boolean(docente.firmaUrl)

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/80">
      {/* Docente / Correo */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar nombre={nombre} tamano="md" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 leading-tight">{nombre}</p>
            <p className="truncate text-xs text-slate-500">{docente.email}</p>
          </div>
        </div>
      </td>

      {/* Identificación */}
      <td className="px-5 py-3.5">
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          CC {docente.documento}
        </span>
      </td>

      {/* Materias */}
      <td className="px-5 py-3.5">
        {docente.materias && docente.materias.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {docente.materias.map((materia) => (
              <Badge key={materia} color={colorPorMateria(materia)}>
                {materia}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Sin materias asignadas</span>
        )}
      </td>

      {/* Firma Digital */}
      <td className="px-5 py-3.5">
        {tieneFirma ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            <CheckCircle2 size={13} className="shrink-0 text-brand-600" />
            Registrada
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            <Clock size={13} className="shrink-0 text-slate-400" />
            Pendiente
          </span>
        )}
      </td>

      {/* Estado */}
      <td className="px-5 py-3.5">
        <Badge color={docente.activo ? 'brand' : 'red'}>
          {docente.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </td>

      {/* Acciones */}
      <td className="px-5 py-3.5 text-right">
        <div className="inline-flex items-center justify-end gap-1">
          {/* Editar */}
          <button
            type="button"
            aria-label={`Editar información de ${nombre}`}
            title="Editar docente"
            onClick={() => onEditar(docente)}
            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <Pencil size={16} />
          </button>

          {/* Activar / Desactivar */}
          <button
            type="button"
            aria-label={`${docente.activo ? 'Desactivar' : 'Activar'} a ${nombre}`}
            title={docente.activo ? 'Desactivar docente' : 'Activar docente'}
            onClick={() => onCambiarEstado(docente)}
            className={`rounded-lg p-1.5 transition cursor-pointer ${
              docente.activo
                ? 'text-amber-600 hover:bg-amber-50'
                : 'text-brand-600 hover:bg-brand-50'
            }`}
          >
            {docente.activo ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>

          {/* Eliminar */}
          <button
            type="button"
            aria-label={`Eliminar registro de ${nombre}`}
            title="Eliminar docente"
            onClick={() => onEliminar(docente)}
            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

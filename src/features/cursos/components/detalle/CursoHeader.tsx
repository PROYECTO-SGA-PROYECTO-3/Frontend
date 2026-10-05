import { Link } from 'react-router-dom'
import { ArrowLeft, School, UserCheck, UserX, ChevronRight, Pencil } from 'lucide-react'
import type { Grado } from '@/shared/types/academico.types'
import { Button } from '@/shared/ui'

export interface CursoHeaderProps {
  curso: Grado
  onEditar?: () => void
}

export function CursoHeader({ curso, onEditar }: CursoHeaderProps) {
  const tieneDirector = Boolean(curso.directorId && curso.nombreDirector)

  return (
    <div className="space-y-4">
      {/* Navegación y Migas de Pan */}
      <nav aria-label="Migas de pan del curso" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link
          to="/admin/cursos"
          className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600 rounded"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Volver al catálogo</span>
        </Link>
        <ChevronRight size={14} className="text-slate-300" aria-hidden="true" />
        <span className="font-semibold text-slate-900 truncate" aria-current="page">
          {curso.nombre}
        </span>
      </nav>

      {/* Cabecera Principal del Curso */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <School size={28} aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {curso.nombre}
              </h1>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                ID #{curso.id}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Grado escolar oficial registrado en la sede principal.
            </p>
          </div>
        </div>

        {/* Acciones y Director de Grupo */}
        <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Director de Grupo
            </p>
            {tieneDirector ? (
              <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-brand-800">
                <UserCheck size={16} className="text-brand-600 shrink-0" aria-hidden="true" />
                <span className="truncate max-w-56">{curso.nombreDirector}</span>
              </div>
            ) : (
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-500">
                <UserX size={15} className="text-slate-400 shrink-0" aria-hidden="true" />
                <span>Sin director asignado</span>
              </div>
            )}
          </div>

          {onEditar && (
            <Button
              variant="secondary"
              onClick={onEditar}
              className="w-auto px-3 py-2 text-xs font-semibold"
            >
              <Pencil size={15} aria-hidden="true" />
              <span>Editar curso</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

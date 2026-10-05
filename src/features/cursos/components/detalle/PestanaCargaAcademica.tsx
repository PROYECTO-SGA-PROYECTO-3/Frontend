import { BookOpen } from 'lucide-react'

export interface PestanaCargaAcademicaProps {
  cursoId: number
  nombreCurso?: string
}

export function PestanaCargaAcademica({
  cursoId,
  nombreCurso,
}: PestanaCargaAcademicaProps) {
  return (
    <div className="space-y-6">
      {/* Contenedor base de la carga académica */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <BookOpen size={24} aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          Carga Académica y Horarios {nombreCurso ? `(${nombreCurso})` : ''}
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
          Sección modular para la asignación y consulta de materias, docentes y distribución horaria del curso #{cursoId}.
        </p>
      </div>
    </div>
  )
}

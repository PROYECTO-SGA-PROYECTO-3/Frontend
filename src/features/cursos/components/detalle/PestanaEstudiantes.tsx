import { Users } from 'lucide-react'

export interface PestanaEstudiantesProps {
  cursoId: number
  nombreCurso?: string
}

export function PestanaEstudiantes({ cursoId, nombreCurso }: PestanaEstudiantesProps) {
  return (
    <div className="space-y-6">
      {/* Contenedor base de la nómina de estudiantes */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Users size={24} aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">
          Nómina de Estudiantes {nombreCurso ? `(${nombreCurso})` : ''}
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
          Sección modular para el listado, búsqueda y control de estudiantes matriculados en el curso #{cursoId}.
        </p>
      </div>
    </div>
  )
}

import { Users } from 'lucide-react'
import { ErrorState, Skeleton } from '@/shared/ui'
import { useEstudiantesCurso } from '../../hooks'

export interface PestanaEstudiantesProps {
  cursoId: number
  nombreCurso?: string
}

export function PestanaEstudiantes({
  cursoId,
  nombreCurso,
}: PestanaEstudiantesProps) {
  const { totalEstudiantes, isLoading, isError, error, refetch } =
    useEstudiantesCurso(cursoId)

  return (
    <div className="space-y-6">
      {/* Estado de carga */}
      {isLoading && (
        <div className="space-y-3" aria-busy="true" aria-label="Cargando estudiantes matriculados">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}

      {/* Manejo de error */}
      {isError && (
        <ErrorState
          titulo="Error al consultar estudiantes del curso"
          mensaje={error}
          onRetry={() => refetch()}
          textoBoton="Reintentar consulta"
        />
      )}

      {/* Consumo exitoso del endpoint */}
      {!isLoading && !isError && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Users size={24} aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Nómina de Estudiantes {nombreCurso ? `(${nombreCurso})` : ''}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
            Actualmente hay {totalEstudiantes} estudiante(s) registrado(s).
          </p>
        </div>
      )}
    </div>
  )
}

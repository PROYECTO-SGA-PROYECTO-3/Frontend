import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/layouts'
import { ErrorState, Button } from '@/shared/ui'
import { useCursoDetalle } from '../hooks'
import { CursoHeader, CursoDetalleSkeleton } from '../components'

export function CursoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const cursoId = Number(id)
  const esIdValido = Number.isInteger(cursoId) && cursoId > 0

  const { curso, isLoading, isError, error, refetch } = useCursoDetalle(cursoId)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Cabecera general de navegación */}
      <PageHeader
        raiz="Portal Académico"
        seccionActual={curso?.nombre ? `Detalle: ${curso.nombre}` : 'Detalle de Curso'}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Validación de ID no numérico o inválido */}
        {!esIdValido && (
          <div className="space-y-4">
            <ErrorState
              titulo="Identificador de curso inválido"
              mensaje="El identificador proporcionado en la ruta no corresponde a un curso válido."
            />
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/cursos')}
                className="w-auto"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Volver a la lista de cursos</span>
              </Button>
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {esIdValido && isLoading && <CursoDetalleSkeleton />}

        {/* Estado de error de red o no encontrado */}
        {esIdValido && !isLoading && (isError || !curso) && (
          <div className="space-y-4">
            <ErrorState
              titulo="No se encontró el curso solicitado"
              mensaje={
                error ??
                'No fue posible obtener los datos del curso. Es posible que haya sido eliminado o no exista.'
              }
              onRetry={() => refetch()}
              textoBoton="Reintentar carga"
            />
            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/admin/cursos')}
                className="w-auto"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                <span>Volver a la lista de cursos</span>
              </Button>
            </div>
          </div>
        )}

        {/* Detalle del curso cargado exitosamente */}
        {esIdValido && !isLoading && curso && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cabecera del Curso */}
            <CursoHeader curso={curso} />

            {/* Espacio reservado para las pestañas de navegación (Fase 2) */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
              <p className="text-sm font-medium text-slate-500">
                Estructura base del curso cargada correctamente.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                La navegación por pestañas (Resumen, Estudiantes, Carga Académica) será incorporada en la siguiente fase.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/layouts'
import { ErrorState, Button, ToastNotificacion } from '@/shared/ui'
import type { SolicitudGrado } from '@/shared/types/academico.types'
import { useCursoDetalle, useCursos, useCursoMutations } from '../hooks'
import {
  CursoHeader,
  CursoDetalleSkeleton,
  CursoTabs,
  CursoModal,
  PestanaEstudiantes,
  PestanaCargaAcademica,
} from '../components'
import type { TabCursoId } from '../components/detalle/CursoTabs'

export function CursoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const cursoId = Number(id)
  const esIdValido = Number.isInteger(cursoId) && cursoId > 0

  // Datos del curso
  const { curso, isLoading, isError, error, refetch } = useCursoDetalle(cursoId)
  const { cursos = [] } = useCursos()
  const { actualizarCurso, estaActualizando } = useCursoMutations()

  // Estado de navegación por pestañas (Estudiantes por defecto)
  const [tabActiva, setTabActiva] = useState<TabCursoId>('estudiantes')

  // Estado del modal de edición rápida
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false)
  const [errorServidorModal, setErrorServidorModal] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const mostrarExitoTemporal = (mensaje: string) => {
    setMensajeExito(mensaje)
    setTimeout(() => {
      setMensajeExito(null)
    }, 4000)
  }

  const existeDuplicado = (nombre: string, ignorarId?: number) => {
    const nombreNormalizado = nombre.trim().toLowerCase()
    return cursos.some(
      (c) =>
        c.nombre.trim().toLowerCase() === nombreNormalizado &&
        c.id !== (ignorarId ?? cursoId),
    )
  }

  const handleGuardarCurso = async (datos: SolicitudGrado) => {
    if (!curso) return
    setErrorServidorModal(null)
    try {
      await actualizarCurso({ id: curso.id, datos })
      mostrarExitoTemporal(
        `El curso "${datos.nombre}" ha sido actualizado exitosamente.`,
      )
      setModalEditarAbierto(false)
    } catch (err: unknown) {
      setErrorServidorModal(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al actualizar los datos del curso.',
      )
    }
  }

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
            {/* Notificación flotante de éxito tras editar */}
            <ToastNotificacion
              mensaje={mensajeExito}
              onCerrar={() => setMensajeExito(null)}
              tipo="exito"
            />

            {/* Cabecera del Curso con acción de editar */}
            <CursoHeader
              curso={curso}
              onEditar={() => {
                setErrorServidorModal(null)
                setModalEditarAbierto(true)
              }}
            />

            {/* Pestañas de Navegación */}
            <CursoTabs
              tabActiva={tabActiva}
              onSeleccionarTab={setTabActiva}
            />

            {/* Contenido según pestaña activa */}
            <div
              role="tabpanel"
              id={`panel-${tabActiva}`}
              aria-labelledby={`tab-${tabActiva}`}
            >
              {tabActiva === 'estudiantes' && (
                <PestanaEstudiantes
                  cursoId={curso.id}
                  nombreCurso={curso.nombre}
                />
              )}

              {tabActiva === 'carga' && (
                <PestanaCargaAcademica
                  cursoId={curso.id}
                  nombreCurso={curso.nombre}
                />
              )}
            </div>

            {/* Modal de edición rápida del grado */}
            <CursoModal
              abierto={modalEditarAbierto}
              cursoAEditar={curso}
              guardando={estaActualizando}
              errorServidor={errorServidorModal}
              existeDuplicado={existeDuplicado}
              onGuardar={handleGuardarCurso}
              onCerrar={() => {
                setModalEditarAbierto(false)
                setErrorServidorModal(null)
              }}
            />
          </div>
        )}
      </main>
    </div>
  )
}

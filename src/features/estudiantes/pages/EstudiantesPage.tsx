import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/layouts'
import { DialogoConfirmacion, ErrorState, ToastNotificacion, type TipoToast } from '@/shared/ui'
import { extraerMensajeError, nombreCompleto } from '@/shared/lib'
import {
  useCatalogoEstudiantes,
  useEstudianteMutations,
  useFiltroEstudiantes,
  useGradosCatalogo,
} from '../hooks'
import {
  EstudiantesEmptyState,
  EstudiantesSkeleton,
  EstudiantesStats,
  EstudiantesTable,
  EstudiantesToolbar,
} from '../components'
import type { Estudiante } from '../types'

export function EstudiantesPage() {
  const navigate = useNavigate()

  const { grados, isLoading: cargandoGrados } = useGradosCatalogo()

  const {
    busqueda,
    setBusqueda,
    busquedaDebounced,
    filtroEstado,
    cambiarEstado,
    filtroGrado,
    cambiarGrado,
    incluirInactivos,
    hayFiltrosActivos,
    limpiarFiltros,
  } = useFiltroEstudiantes({
    debounceMs: 350,
  })

  const {
    estudiantes,
    totalElementos,
    totalPaginas,
    pagina,
    tamanoPagina,
    setPagina,
    setTamanoPagina,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useCatalogoEstudiantes({
    tamanoInicial: 10,
    incluirInactivos,
    termino: busquedaDebounced,
    gradoId: filtroGrado ? Number(filtroGrado) : undefined,
  })

  // 4. Operaciones de mutación con invalidación de caché
  const {
    activarEstudiante,
    estaActivando,
    desactivarEstudiante,
    estaDesactivando,
    eliminarEstudiante,
    estaEliminando,
  } = useEstudianteMutations()

  const location = useLocation()

  // 5. Diálogos de confirmación y feedback flotante (Toast)
  const [estudianteACambiarEstado, setEstudianteACambiarEstado] = useState<Estudiante | null>(null)
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<Estudiante | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [toast, setToast] = useState<{ mensaje: string; tipo: TipoToast } | null>(null)

  const notificarToast = (mensaje: string, tipo: TipoToast = 'exito') => {
    setToast({ mensaje, tipo })
  }

  const handleCerrarToast = () => {
    setToast(null)
  }

  // Capturar mensajes emitidos por redirecciones de formularios (creación / edición)
  useEffect(() => {
    const estado = location.state as { mensajeFeedback?: string; tipoFeedback?: TipoToast } | null
    if (estado?.mensajeFeedback) {
      notificarToast(estado.mensajeFeedback, estado.tipoFeedback || 'exito')
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Navegación
  const handleCrear = () => {
    navigate('/admin/estudiantes/nuevo')
  }

  const handleEditar = (estudiante: Estudiante) => {
    navigate(`/admin/estudiantes/${estudiante.id}/editar`)
  }

  const handleVerPerfil = (estudiante: Estudiante) => {
    navigate(`/admin/estudiantes/${estudiante.id}/perfil`)
  }

  // Confirmar cambio de estado (Activar / Desactivar)
  const handleConfirmarCambioEstado = async () => {
    if (!estudianteACambiarEstado) return
    setErrorAccion(null)
    try {
      const nombre = nombreCompleto(estudianteACambiarEstado)
      if (estudianteACambiarEstado.activo) {
        await desactivarEstudiante(estudianteACambiarEstado.id)
        notificarToast(`Estudiante ${nombre} desactivado del sistema.`, 'exito')
      } else {
        await activarEstudiante(estudianteACambiarEstado.id)
        notificarToast(`Estudiante ${nombre} reactivado exitosamente.`, 'exito')
      }
      setEstudianteACambiarEstado(null)
    } catch (err: unknown) {
      setErrorAccion(extraerMensajeError(err))
    }
  }

  // Confirmar eliminación definitiva
  const handleConfirmarEliminar = async () => {
    if (!estudianteAEliminar) return
    setErrorAccion(null)
    try {
      const nombre = nombreCompleto(estudianteAEliminar)
      await eliminarEstudiante(estudianteAEliminar.id)
      notificarToast(`Registro de ${nombre} eliminado de la institución.`, 'exito')
      setEstudianteAEliminar(null)
    } catch (err: unknown) {
      setErrorAccion(extraerMensajeError(err))
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader
        raiz="Portal Administrativo"
        seccionActual="Estudiantes"
      />

      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-8 p-6 md:p-8 xl:p-10">

        {/* Estado de Error del Servidor */}
        {isError && (
          <ErrorState
            titulo="No se pudo cargar el directorio de estudiantes"
            mensaje={error ? extraerMensajeError(error) : 'Ocurrió un error inesperado al conectar con el servidor.'}
            onRetry={() => refetch()}
            variant="card"
          />
        )}

        {/* Estado de Carga Inicial (Skeleton) */}
        {isLoading && !isError && <EstudiantesSkeleton cantidadFilas={tamanoPagina} />}

        {/* Contenido Principal */}
        {!isLoading && !isError && (
          <div className="space-y-6">
            {/* Métricas y resumen analítico esencial */}
            <EstudiantesStats
              totalGlobal={totalElementos}
              estudiantesEnPagina={estudiantes}
            />

            {/* Barra de herramientas y filtros */}
            <EstudiantesToolbar
              busqueda={busqueda}
              filtroEstado={filtroEstado}
              filtroGrado={filtroGrado}
              grados={grados}
              cargandoGrados={cargandoGrados}
              hayFiltros={hayFiltrosActivos}
              onCambioBusqueda={setBusqueda}
              onCambioEstado={cambiarEstado}
              onCambioGrado={cambiarGrado}
              onLimpiarFiltros={limpiarFiltros}
              onCrear={handleCrear}
            />

            {/* Tabla de Resultados con Paginación conectada al Backend o Estado Vacío */}
            {estudiantes.length > 0 ? (
              <EstudiantesTable
                estudiantes={estudiantes}
                paginaActual={pagina}
                totalPaginas={totalPaginas}
                totalElementos={totalElementos}
                tamanoPagina={tamanoPagina}
                isFetching={isFetching}
                onCambiarPagina={setPagina}
                onCambiarTamanoPagina={setTamanoPagina}
                onVerPerfil={handleVerPerfil}
                onEditar={handleEditar}
                onCambiarEstado={setEstudianteACambiarEstado}
                onEliminar={setEstudianteAEliminar}
              />
            ) : (
              <EstudiantesEmptyState
                hayFiltros={hayFiltrosActivos}
                onLimpiarFiltros={limpiarFiltros}
                onCrear={handleCrear}
              />
            )}
          </div>
        )}
      </main>

      {/* Modal de confirmación para cambio de estado (Activar / Desactivar) */}
      <DialogoConfirmacion
        abierto={Boolean(estudianteACambiarEstado)}
        titulo={
          estudianteACambiarEstado?.activo ? 'Desactivar estudiante' : 'Activar estudiante'
        }
        mensaje={
          estudianteACambiarEstado
            ? estudianteACambiarEstado.activo
              ? `¿Seguro que deseas desactivar a ${nombreCompleto(estudianteACambiarEstado)}? Se conservará su historial y calificaciones, pero no podrá iniciar sesión en la plataforma.`
              : `¿Seguro que deseas reactivar la cuenta de ${nombreCompleto(estudianteACambiarEstado)}? Podrá acceder nuevamente al portal estudiantil.`
            : ''
        }
        error={errorAccion ?? undefined}
        procesando={estaActivando || estaDesactivando}
        textoConfirmar={estudianteACambiarEstado?.activo ? 'Desactivar' : 'Activar'}
        onConfirmar={handleConfirmarCambioEstado}
        onCancelar={() => {
          setEstudianteACambiarEstado(null)
          setErrorAccion(null)
        }}
      />

      {/* Modal de confirmación para eliminación permanente */}
      <DialogoConfirmacion
        abierto={Boolean(estudianteAEliminar)}
        titulo="Eliminar registro de estudiante"
        mensaje={
          estudianteAEliminar
            ? `¿Seguro que deseas eliminar definitivamente a ${nombreCompleto(estudianteAEliminar)}? Esta acción es irreversible. El estudiante debe estar inactivo y no poseer calificaciones ni matrículas asociadas.`
            : ''
        }
        error={errorAccion ?? undefined}
        procesando={estaEliminando}
        textoConfirmar="Eliminar definitivamente"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => {
          setEstudianteAEliminar(null)
          setErrorAccion(null)
        }}
      />

      {/* Notificación flotante del sistema */}
      <ToastNotificacion
        mensaje={toast?.mensaje ?? null}
        tipo={toast?.tipo ?? 'exito'}
        onCerrar={handleCerrarToast}
      />
    </div>
  )
}


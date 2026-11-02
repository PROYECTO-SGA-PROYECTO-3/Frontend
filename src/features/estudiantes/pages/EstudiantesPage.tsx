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

/** Acciones de la tabla que requieren confirmación del administrador. */
type AccionPendiente =
  | { tipo: 'cambiar-estado'; estudiante: Estudiante }
  | { tipo: 'eliminar'; estudiante: Estudiante }

/** Textos y efecto de una acción pendiente, para resolverla con un único diálogo. */
interface AccionConfirmable {
  titulo: string
  mensaje: string
  textoConfirmar: string
  procesando: boolean
  mensajeExito: string
  ejecutar: () => Promise<unknown>
}

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
    activo,
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
    activo,
    termino: busquedaDebounced,
    gradoId: filtroGrado || undefined,
  })

  // Operaciones de mutación con invalidación de caché
  const {
    activarEstudiante,
    estaActivando,
    desactivarEstudiante,
    estaDesactivando,
    eliminarEstudiante,
    estaEliminando,
  } = useEstudianteMutations()

  const location = useLocation()

  // Diálogos de confirmación y feedback flotante (Toast)
  const [accionPendiente, setAccionPendiente] = useState<AccionPendiente | null>(null)
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

  // Textos y efecto de cada acción confirmable, declarados en un solo lugar
  const describirAccion = ({ tipo, estudiante }: AccionPendiente): AccionConfirmable => {
    const nombre = nombreCompleto(estudiante)

    if (tipo === 'eliminar') {
      return {
        titulo: 'Eliminar registro de estudiante',
        mensaje: `¿Seguro que deseas eliminar definitivamente a ${nombre}? Esta acción es irreversible. El estudiante debe estar inactivo y no poseer calificaciones ni matrículas asociadas.`,
        textoConfirmar: 'Eliminar definitivamente',
        procesando: estaEliminando,
        mensajeExito: `Registro de ${nombre} eliminado de la institución.`,
        ejecutar: () => eliminarEstudiante(estudiante.id),
      }
    }

    if (estudiante.activo) {
      return {
        titulo: 'Desactivar estudiante',
        mensaje: `¿Seguro que deseas desactivar a ${nombre}? Se conservará su historial y calificaciones, pero no podrá iniciar sesión en la plataforma.`,
        textoConfirmar: 'Desactivar',
        procesando: estaDesactivando,
        mensajeExito: `Estudiante ${nombre} desactivado del sistema.`,
        ejecutar: () => desactivarEstudiante(estudiante.id),
      }
    }

    return {
      titulo: 'Activar estudiante',
      mensaje: `¿Seguro que deseas reactivar la cuenta de ${nombre}? Podrá acceder nuevamente al portal estudiantil.`,
      textoConfirmar: 'Activar',
      procesando: estaActivando,
      mensajeExito: `Estudiante ${nombre} reactivado exitosamente.`,
      ejecutar: () => activarEstudiante(estudiante.id),
    }
  }

  const accionConfirmable = accionPendiente ? describirAccion(accionPendiente) : null

  const cerrarAccion = () => {
    setAccionPendiente(null)
    setErrorAccion(null)
  }

  const handleConfirmarAccion = async () => {
    if (!accionConfirmable) return
    setErrorAccion(null)
    try {
      await accionConfirmable.ejecutar()
      notificarToast(accionConfirmable.mensajeExito, 'exito')
      setAccionPendiente(null)
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
            mensaje={error ?? 'Ocurrió un error inesperado al conectar con el servidor.'}
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
                onCambiarEstado={(estudiante) =>
                  setAccionPendiente({ tipo: 'cambiar-estado', estudiante })
                }
                onEliminar={(estudiante) => setAccionPendiente({ tipo: 'eliminar', estudiante })}
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

      {/* Modal único de confirmación: activar, desactivar o eliminar */}
      <DialogoConfirmacion
        abierto={Boolean(accionConfirmable)}
        titulo={accionConfirmable?.titulo ?? ''}
        mensaje={accionConfirmable?.mensaje ?? ''}
        error={errorAccion ?? undefined}
        procesando={accionConfirmable?.procesando ?? false}
        textoConfirmar={accionConfirmable?.textoConfirmar}
        onConfirmar={handleConfirmarAccion}
        onCancelar={cerrarAccion}
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


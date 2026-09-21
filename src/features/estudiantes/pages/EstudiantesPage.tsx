import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/layouts'
import { DialogoConfirmacion, ErrorState } from '@/shared/ui'
import { nombreCompleto } from '@/shared/lib/utils'
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

  // 5. Diálogos de confirmación y feedback
  const [estudianteACambiarEstado, setEstudianteACambiarEstado] = useState<Estudiante | null>(null)
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<Estudiante | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const notificarExito = (msg: string) => {
    setMensajeExito(msg)
    setTimeout(() => {
      setMensajeExito(null)
    }, 4000)
  }

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
        notificarExito(`Estudiante ${nombre} desactivado del sistema.`)
      } else {
        await activarEstudiante(estudianteACambiarEstado.id)
        notificarExito(`Estudiante ${nombre} reactivado exitosamente.`)
      }
      setEstudianteACambiarEstado(null)
    } catch (err: unknown) {
      setErrorAccion(
        err instanceof Error ? err.message : 'Error al cambiar el estado del estudiante.',
      )
    }
  }

  // Confirmar eliminación definitiva
  const handleConfirmarEliminar = async () => {
    if (!estudianteAEliminar) return
    setErrorAccion(null)
    try {
      const nombre = nombreCompleto(estudianteAEliminar)
      await eliminarEstudiante(estudianteAEliminar.id)
      notificarExito(`Registro de ${nombre} eliminado de la institución.`)
      setEstudianteAEliminar(null)
    } catch (err: unknown) {
      setErrorAccion(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el estudiante. Asegúrate de que no tenga matrículas, notas ni historial académico registrado.',
      )
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <Navbar
        titulo="Estudiantes"
        subtitulo="Directorio, historial académico y gestión del alumnado"
        sistemaEnLinea
      />

      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-8 p-6 md:p-8 xl:p-10">
        {/* Banner de notificación de éxito */}
        {mensajeExito && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50/90 px-4 py-3 text-sm text-brand-900 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-700 shrink-0" />
              <span className="font-medium">{mensajeExito}</span>
            </div>
            <button
              type="button"
              onClick={() => setMensajeExito(null)}
              aria-label="Cerrar notificación"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Estado de Error del Servidor */}
        {isError && (
          <ErrorState
            titulo="No se pudo cargar el directorio de estudiantes"
            mensaje={error instanceof Error ? error.message : 'Ocurrió un error inesperado al conectar con el servidor.'}
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
    </div>
  )
}

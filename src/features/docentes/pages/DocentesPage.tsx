import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/layouts'
import { DialogoConfirmacion, ErrorState } from '@/shared/ui'
import { nombreCompleto } from '@/shared/lib/utils'
import {
  useCatalogoDocentes,
  useDocenteMutations,
  useFiltroDocentes,
} from '../hooks'
import {
  DocentesEmptyState,
  DocentesSkeleton,
  DocentesStats,
  DocentesTable,
  DocentesToolbar,
} from '../components'
import type { Docente } from '../types'

export default function DocentesPage() {
  const navigate = useNavigate()

  // 1. Catálogo del servidor mediante React Query
  const {
    docentes,
    totalElementos,
    totalPaginas,
    pagina,
    tamanoPagina,
    setPagina,
    setTamanoPagina,
    isLoading,
    isError,
    error,
    refetch,
  } = useCatalogoDocentes({ tamanoInicial: 5 })


  // 2. Operaciones de mutación
  const {
    activarDocente,
    estaActivando,
    desactivarDocente,
    estaDesactivando,
    eliminarDocente,
    estaEliminando,
  } = useDocenteMutations()

  // 3. Filtros reactivos y cómputos en cliente
  const {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroFirma,
    setFiltroFirma,
    orden,
    setOrden,
    docentesFiltrados,
    totalDocentes,
    totalFiltrados,
    totalActivos,
    totalInactivos,
    totalConFirma,
    hayFiltroActivo,
    limpiarFiltros,
  } = useFiltroDocentes(docentes)

  // 4. Diálogos de confirmación y feedback
  const [docenteACambiarEstado, setDocenteACambiarEstado] = useState<Docente | null>(null)
  const [docenteAEliminar, setDocenteAEliminar] = useState<Docente | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const notificarExito = (msg: string) => {
    setMensajeExito(msg)
    setTimeout(() => {
      setMensajeExito(null)
    }, 4000)
  }

  // Navegación a formularios
  const handleCrear = () => {
    navigate('/admin/docentes/nuevo')
  }

  const handleEditar = (docente: Docente) => {
    navigate(`/admin/docentes/${docente.id}/editar`)
  }

  // Confirmar cambio de estado (Activar / Desactivar)
  const handleConfirmarCambioEstado = async () => {
    if (!docenteACambiarEstado) return
    setErrorAccion(null)
    try {
      const nombre = nombreCompleto(docenteACambiarEstado)
      if (docenteACambiarEstado.activo) {
        await desactivarDocente(docenteACambiarEstado.id)
        notificarExito(`Docente ${nombre} desactivado temporalmente.`)
      } else {
        await activarDocente(docenteACambiarEstado.id)
        notificarExito(`Docente ${nombre} reactivado exitosamente.`)
      }
      setDocenteACambiarEstado(null)
    } catch (err: unknown) {
      setErrorAccion(err instanceof Error ? err.message : 'Error al cambiar el estado del docente.')
    }
  }

  // Confirmar eliminación definitiva
  const handleConfirmarEliminar = async () => {
    if (!docenteAEliminar) return
    setErrorAccion(null)
    try {
      const nombre = nombreCompleto(docenteAEliminar)
      await eliminarDocente(docenteAEliminar.id)
      notificarExito(`Registro de ${nombre} eliminado de la institución.`)
      setDocenteAEliminar(null)
    } catch (err: unknown) {
      setErrorAccion(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el docente. Asegúrate de que no tenga materias o cargas académicas asignadas.',
      )
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader
        raiz="Portal Administrativo"
        seccionActual="Docentes"
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
              className="cursor-pointer text-brand-700 hover:text-brand-900"
            >
              &times;
            </button>
          </div>
        )}

        {/* Encabezado del módulo */}
        <section className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gestión de Docentes
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Administra a los educadores de la institución, gestiona sus firmas digitales
            y supervisa su estado de habilitación para el año lectivo.
          </p>
        </section>

        {/* Tarjetas de Estadísticas Globales */}
        <DocentesStats
          totalDocentes={totalDocentes}
          totalActivos={totalActivos}
          totalInactivos={totalInactivos}
          totalConFirma={totalConFirma}
          hayFiltroActivo={hayFiltroActivo}
          totalFiltrados={totalFiltrados}
        />

        {/* Barra de herramientas: Búsqueda, filtros y botón de registro */}
        <DocentesToolbar
          busqueda={busqueda}
          filtroEstado={filtroEstado}
          filtroFirma={filtroFirma}
          orden={orden}
          onCambioBusqueda={setBusqueda}
          onCambioEstado={setFiltroEstado}
          onCambioFirma={setFiltroFirma}
          onCambioOrden={setOrden}
          onCrear={handleCrear}
          onLimpiarFiltros={limpiarFiltros}
          hayFiltros={hayFiltroActivo}
        />

        {/* Contenido principal: Tabla, Skeleton o Estados Vacíos */}
        <section aria-label="Directorio de docentes">
          {isLoading ? (
            <DocentesSkeleton cantidadFilas={6} />
          ) : isError ? (
            <ErrorState
              titulo="Error al cargar el listado de docentes"
              mensaje={error}
              onRetry={() => refetch()}
            />
          ) : docentes.length === 0 ? (
            <DocentesEmptyState esBusqueda={false} onCrear={handleCrear} />
          ) : docentesFiltrados.length === 0 ? (
            <DocentesEmptyState
              esBusqueda={true}
              terminoBusqueda={busqueda}
              onCrear={handleCrear}
              onLimpiarFiltros={limpiarFiltros}
            />
          ) : (
            <DocentesTable
              docentes={docentesFiltrados}
              paginaActual={pagina}
              totalPaginas={totalPaginas}
              totalElementos={totalElementos}
              tamanoPagina={tamanoPagina}
              onCambiarPagina={setPagina}
              onCambiarTamanoPagina={setTamanoPagina}
              onEditar={handleEditar}
              onCambiarEstado={setDocenteACambiarEstado}
              onEliminar={setDocenteAEliminar}
            />

          )}
        </section>
      </main>

      {/* Diálogo de confirmación: Activar / Desactivar */}
      <DialogoConfirmacion
        abierto={Boolean(docenteACambiarEstado)}
        titulo={docenteACambiarEstado?.activo ? 'Desactivar docente' : 'Activar docente'}
        mensaje={
          docenteACambiarEstado
            ? docenteACambiarEstado.activo
              ? `¿Seguro que deseas desactivar a ${nombreCompleto(docenteACambiarEstado)}? Su registro se conservará, pero quedará marcado como inactivo y no podrá acceder a la plataforma.`
              : `¿Seguro que deseas reactivar a ${nombreCompleto(docenteACambiarEstado)}? Podrá volver a iniciar sesión y gestionar sus calificaciones.`
            : ''
        }
        error={errorAccion ?? undefined}
        procesando={estaActivando || estaDesactivando}
        textoConfirmar={docenteACambiarEstado?.activo ? 'Desactivar' : 'Activar'}
        onConfirmar={handleConfirmarCambioEstado}
        onCancelar={() => {
          setDocenteACambiarEstado(null)
          setErrorAccion(null)
        }}
      />

      {/* Diálogo de confirmación: Eliminar definitivamente */}
      <DialogoConfirmacion
        abierto={Boolean(docenteAEliminar)}
        titulo="Eliminar docente"
        mensaje={
          docenteAEliminar
            ? `¿Seguro que deseas eliminar permanentemente a ${nombreCompleto(docenteAEliminar)}? Esta acción es irreversible. El docente debe estar previamente inactivo y no poseer asignaturas vinculadas.`
            : ''
        }
        error={errorAccion ?? undefined}
        procesando={estaEliminando}
        textoConfirmar="Eliminar registro"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => {
          setDocenteAEliminar(null)
          setErrorAccion(null)
        }}
      />
    </div>
  )
}


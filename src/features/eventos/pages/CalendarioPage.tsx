import { useMemo, useState } from 'react'
import { Plus, CheckCircle2, CalendarDays } from 'lucide-react'
import { useRol, Can } from '@/features/auth'
import { PageHeader } from '@/layouts'
import { Button, DialogoConfirmacion, ErrorState } from '@/shared/ui'
import { extraerMensajeError } from '@/shared/lib/axios'
import { useEventosInstitucionales } from '../hooks/useEventosInstitucionales'
import { useEventoMutations } from '../hooks/useEventoMutations'
import { TarjetaEvento } from '../components/TarjetaEvento'
import { CrearEventoModal } from '../components/CrearEventoModal'
import { EventosSkeleton } from '../components/EventosSkeleton'
import { EventosEmptyState } from '../components/EventosEmptyState'
import type { EventoInstitucional, SolicitudCrearEvento } from '../types'

export interface CalendarioPageProps {
  /** Permite forzar modo solo lectura independientemente del rol */
  soloLectura?: boolean
}

export default function CalendarioPage({ soloLectura = false }: CalendarioPageProps) {
  const rol = useRol()
  const esAdmin = !soloLectura && rol === 'ADMIN'

  // Consulta de eventos institucionales
  const { data: eventos, isLoading, isError, error, refetch } = useEventosInstitucionales()

  // Operaciones de mutación
  const { crearEvento, estaCreando, eliminarEvento, estaEliminando, errorEliminar } =
    useEventoMutations()

  // Estados locales para modales y confirmaciones
  const [modalAbierto, setModalAbierto] = useState(false)
  const [eventoAEliminar, setEventoAEliminar] = useState<EventoInstitucional | null>(null)
  const [errorDialogo, setErrorDialogo] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const mostrarExitoTemporal = (mensaje: string) => {
    setMensajeExito(mensaje)
    setTimeout(() => {
      setMensajeExito(null)
    }, 4000)
  }

  // Ordenar cronológicamente los eventos por fecha
  const eventosOrdenados = useMemo(() => {
    if (!eventos) return []
    return [...eventos].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
    )
  }, [eventos])

  // Crear evento
  const handleCrearEvento = async (datos: SolicitudCrearEvento) => {
    await crearEvento(datos)
    mostrarExitoTemporal(`Evento "${datos.titulo}" programado exitosamente.`)
  }

  // Confirmar eliminación
  const handleConfirmarEliminar = async () => {
    if (!eventoAEliminar) return
    setErrorDialogo(null)
    try {
      await eliminarEvento(eventoAEliminar.id)
      const tituloEliminado = eventoAEliminar.titulo
      setEventoAEliminar(null)
      mostrarExitoTemporal(`Evento "${tituloEliminado}" eliminado del calendario.`)
    } catch (err) {
      setErrorDialogo(extraerMensajeError(err))
    }
  }

  // Breadcrumbs según el rol
  const portalRaiz =
    rol === 'ADMIN'
      ? 'Portal Administrativo'
      : rol === 'DOCENTE'
      ? 'Portal Docente'
      : 'Portal Estudiantil'

  return (
    <div className="flex flex-1 flex-col bg-slate-50/50">
      <PageHeader raiz={portalRaiz} seccionActual="Calendario Institucional" />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-6 md:p-8 xl:p-10">
        {/* Notificación flotante de éxito */}
        {mensajeExito && (
          <div
            role="status"
            className="fixed bottom-6 right-6 z-50 flex max-w-md items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white/95 p-4 text-sm text-slate-800 shadow-xl backdrop-blur-xs animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <CheckCircle2 size={18} aria-hidden="true" />
              </div>
              <span className="font-medium text-slate-900">{mensajeExito}</span>
            </div>
            <button
              type="button"
              onClick={() => setMensajeExito(null)}
              aria-label="Cerrar notificación"
              className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Encabezado y resumen de la vista */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-700/10 mt-0.5">
              <CalendarDays size={24} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Calendario Institucional
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {esAdmin
                  ? 'Gestiona y programa los eventos, jornadas académicas y actividades de la institución.'
                  : 'Consulta todos los eventos, fechas especiales y actividades programadas por la institución.'}
              </p>
            </div>
          </div>

          <Can roles={['ADMIN']}>
            {!soloLectura && (
              <div className="w-auto shrink-0">
                <Button
                  variant="primary"
                  className="w-auto"
                  onClick={() => setModalAbierto(true)}
                >
                  <Plus size={18} aria-hidden="true" />
                  <span>Nuevo evento</span>
                </Button>
              </div>
            )}
          </Can>
        </section>

        {/* Contenido: Skeleton, ErrorState, EmptyState o Listado de Tarjetas */}
        <section aria-label="Eventos del calendario">
          {isLoading ? (
            <EventosSkeleton cantidad={5} />
          ) : isError ? (
            <ErrorState
              titulo="Error al cargar el calendario institucional"
              mensaje={extraerMensajeError(error)}
              onRetry={() => refetch()}
            />
          ) : eventosOrdenados.length === 0 ? (
            <EventosEmptyState puedeCrear={esAdmin} onCrear={() => setModalAbierto(true)} />
          ) : (
            <ul className="flex flex-col gap-3.5" role="list">
              {eventosOrdenados.map((evento) => (
                <li key={evento.id}>
                  <TarjetaEvento
                    evento={evento}
                    puedeEliminar={esAdmin}
                    onEliminar={(ev) => {
                      setErrorDialogo(null)
                      setEventoAEliminar(ev)
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Modales y diálogos exclusivos para Administradores con autorización declarativa */}
      <Can roles={['ADMIN']}>
        {!soloLectura && (
          <>
            <CrearEventoModal
              abierto={modalAbierto}
              onCerrar={() => setModalAbierto(false)}
              onCrear={handleCrearEvento}
              estaCreando={estaCreando}
            />

            <DialogoConfirmacion
              abierto={Boolean(eventoAEliminar)}
              titulo="Eliminar Evento Institucional"
              mensaje={
                eventoAEliminar
                  ? `¿Estás seguro de que deseas eliminar el evento "${eventoAEliminar.titulo}" del calendario? Esta acción no se puede deshacer.`
                  : ''
              }
              error={errorDialogo ?? errorEliminar ?? undefined}
              procesando={estaEliminando}
              textoConfirmar="Eliminar evento"
              onConfirmar={handleConfirmarEliminar}
              onCancelar={() => {
                setEventoAEliminar(null)
                setErrorDialogo(null)
              }}
            />
          </>
        )}
      </Can>
    </div>
  )
}

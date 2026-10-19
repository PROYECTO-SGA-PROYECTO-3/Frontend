import { useState, type KeyboardEvent } from 'react'
import { X, AlertCircle, Calendar } from 'lucide-react'
import { DialogoConfirmacion } from '@/shared/ui/DialogoConfirmacion'
import { ToastNotificacion } from '@/shared/ui/ToastNotificacion'
import type { AnioLectivo } from '@/shared/types/anioLectivo.types'
import { usePeriodosQuery } from '../hooks/usePeriodosQuery'
import { usePeriodosMutations } from '../hooks/usePeriodosMutations'
import { PeriodoForm } from './PeriodoForm'
import { PeriodosTabla } from './PeriodosTabla'
import type { Periodo, SolicitudPeriodo } from '../types'

interface PeriodosAnioModalProps {
  anio: AnioLectivo
  esActivo: boolean
  onCerrar: () => void
}

export function PeriodosAnioModal({ anio, esActivo, onCerrar }: PeriodosAnioModalProps) {
  const [periodoEditando, setPeriodoEditando] = useState<Periodo | 'nuevo' | null>(null)
  const [periodoAEliminar, setPeriodoAEliminar] = useState<Periodo | null>(null)
  const [toastMensaje, setToastMensaje] = useState<string | null>(null)

  const { periodos, isLoading, errorCarga, refetch } = usePeriodosQuery(anio.id)

  const handleReintentar = () => {
    void refetch()
  }

  const handleExitoGuardar = (periodo: Periodo) => {
    setPeriodoEditando(null)
    setToastMensaje(`Periodo "${periodo.nombre}" guardado exitosamente.`)
  }

  const handleExitoAlternar = (periodo: Periodo) => {
    setToastMensaje(
      `Periodo "${periodo.nombre}" ${periodo.cerradoParaDocentes ? 'cerrado' : 'reabierto'} exitosamente.`
    )
  }

  const handleExitoEliminar = (id: number) => {
    const eliminado = periodos.find((p) => p.id === id)
    setPeriodoAEliminar(null)
    setToastMensaje(
      eliminado
        ? `Periodo "${eliminado.nombre}" eliminado exitosamente.`
        : 'Periodo eliminado exitosamente.'
    )
  }

  const {
    guardarPeriodo,
    guardando,
    errorGuardar,
    limpiarErrorGuardar,
    alternarEstado,
    alternandoEstado,
    eliminarPeriodo,
    eliminando,
    errorEliminar,
    limpiarErrorEliminar,
  } = usePeriodosMutations({
    anioId: anio.id,
    onExitoGuardar: handleExitoGuardar,
    onExitoAlternar: handleExitoAlternar,
    onExitoEliminar: handleExitoEliminar,
  })

  const handleIniciarCrear = () => {
    limpiarErrorGuardar()
    setPeriodoEditando('nuevo')
  }

  const handleIniciarEditar = (periodo: Periodo) => {
    limpiarErrorGuardar()
    setPeriodoEditando(periodo)
  }

  const handleCancelarEdicion = () => {
    setPeriodoEditando(null)
  }

  const handleSubmitForm = (datos: Omit<SolicitudPeriodo, 'anioLectivoId'>) => {
    const id = periodoEditando && periodoEditando !== 'nuevo' ? periodoEditando.id : undefined
    guardarPeriodo({ ...datos, anioLectivoId: anio.id }, id)
  }

  const handleSolicitarEliminacion = (periodo: Periodo) => {
    limpiarErrorEliminar()
    setPeriodoAEliminar(periodo)
  }

  const handleConfirmarEliminacion = () => {
    if (periodoAEliminar) {
      eliminarPeriodo(periodoAEliminar.id)
    }
  }

  const handleCancelarEliminacion = () => {
    if (!eliminando) {
      limpiarErrorEliminar()
      setPeriodoAEliminar(null)
    }
  }

  const handleCerrarToast = () => {
    setToastMensaje(null)
  }

  const handleKeyDownDialogo = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !guardando && !eliminando && !periodoAEliminar) {
      onCerrar()
    }
  }

  return (
    <div
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDownDialogo}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200 outline-none"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Periodos Académicos — {anio.anio}</h3>
              <p className="text-xs text-slate-500">
                {esActivo ? 'Año lectivo activo en curso' : 'Año en modo consulta histórica'}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onCerrar}
            disabled={guardando || eliminando}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {!esActivo && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent-300 bg-accent-100/50 p-3 text-xs text-accent-700">
            <AlertCircle size={16} className="shrink-0 text-accent-600" />
            <span>
              Solo se pueden crear o modificar periodos en el año lectivo activo. Este año es de consulta histórica.
            </span>
          </div>
        )}

        {periodoEditando ? (
          <PeriodoForm
            key={periodoEditando === 'nuevo' ? 'nuevo' : periodoEditando.id}
            periodoEditando={periodoEditando}
            guardando={guardando}
            errorServidor={errorGuardar}
            onCancelar={handleCancelarEdicion}
            onSubmit={handleSubmitForm}
          />
        ) : (
          <PeriodosTabla
            periodos={periodos}
            isLoading={isLoading}
            errorCarga={errorCarga}
            esActivo={esActivo}
            alternandoEstado={alternandoEstado}
            onReintentar={handleReintentar}
            onIniciarCrear={handleIniciarCrear}
            onIniciarEditar={handleIniciarEditar}
            onAlternarEstado={alternarEstado}
            onSolicitarEliminar={handleSolicitarEliminacion}
          />
        )}
      </div>

      {/* Diálogo de confirmación destructiva para eliminar periodo */}
      <DialogoConfirmacion
        abierto={Boolean(periodoAEliminar)}
        titulo="Eliminar periodo académico"
        mensaje={
          periodoAEliminar
            ? `¿Confirmas que deseas eliminar permanentemente el "${periodoAEliminar.nombre}" (${periodoAEliminar.porcentaje}%)? Esta acción es irreversible y solo se procesará si no contiene calificaciones ni actividad evaluativa registrada.`
            : ''
        }
        error={errorEliminar ?? undefined}
        procesando={eliminando}
        textoConfirmar="Eliminar Periodo"
        varianteConfirmar="peligro"
        onConfirmar={handleConfirmarEliminacion}
        onCancelar={handleCancelarEliminacion}
      />

      {/* Notificación flotante de confirmación */}
      {toastMensaje && (
        <ToastNotificacion
          mensaje={toastMensaje}
          tipo="exito"
          onCerrar={handleCerrarToast}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { X, SlidersHorizontal, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button, Badge, type BadgeColor } from '@/shared/ui'
import type { Matricula, EstadoMatricula } from '@/shared/types/matricula.types'
import { useCambiarEstadoMatricula } from '../../hooks'

export interface CambiarEstadoMatriculaModalProps {
  abierto: boolean
  matricula: Matricula | null
  cursoId: number
  nombreCurso?: string
  onCerrar: () => void
  onExito: (nombreEstudiante: string, nuevoEstado: EstadoMatricula) => void
}

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  RETIRADA: 'red',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
}

const OPCIONES_ESTADO_DESTINO: {
  estado: EstadoMatricula
  titulo: string
  descripcion: string
  colorBadge: BadgeColor
}[] = [
  {
    estado: 'RETIRADA',
    titulo: 'Retirada',
    descripcion:
      'El estudiante abandona el curso o la institución educativa. Conserva su historial académico.',
    colorBadge: 'red',
  },
  {
    estado: 'PROMOVIDA',
    titulo: 'Promovida',
    descripcion:
      'El estudiante aprueba satisfactoriamente todos los logros y contenidos del curso.',
    colorBadge: 'blue',
  },
  {
    estado: 'REPROBADA',
    titulo: 'Reprobada',
    descripcion:
      'El estudiante no supera los criterios académicos mínimos para aprobar el año lectivo.',
    colorBadge: 'orange',
  },
]

export function CambiarEstadoMatriculaModal(
  props: CambiarEstadoMatriculaModalProps,
) {
  if (!props.abierto || !props.matricula) return null

  return (
    <CambiarEstadoDialog
      key={props.matricula.id}
      {...props}
      matricula={props.matricula}
    />
  )
}

interface CambiarEstadoDialogProps extends CambiarEstadoMatriculaModalProps {
  matricula: Matricula
}

function CambiarEstadoDialog({
  matricula,
  cursoId,
  nombreCurso,
  onCerrar,
  onExito,
}: CambiarEstadoDialogProps) {
  const [nuevoEstado, setNuevoEstado] = useState<EstadoMatricula | ''>('')

  const {
    cambiarEstado,
    estaCambiandoEstado,
    errorCambioEstado,
    resetearError,
  } = useCambiarEstadoMatricula(cursoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoEstado || nuevoEstado === matricula.estado) return

    try {
      await cambiarEstado({
        matriculaId: matricula.id,
        datos: { nuevoEstado },
      })
      onExito(matricula.nombreCompletoEstudiante, nuevoEstado)
      onCerrar()
    } catch {
      // El error se gestiona reactivamente mediante errorCambioEstado
    }
  }

  const handleKeyDownDialogo = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !estaCambiandoEstado) {
      e.stopPropagation()
      onCerrar()
    }
  }

  const handleFondoClick = () => {
    if (!estaCambiandoEstado) {
      onCerrar()
    }
  }

  const handleSeleccionarOpcion = (estado: EstadoMatricula) => {
    resetearError()
    setNuevoEstado(estado)
  }

  const esValido =
    Boolean(nuevoEstado) &&
    nuevoEstado !== matricula.estado &&
    !estaCambiandoEstado

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cambiar-estado-titulo"
      onKeyDown={handleKeyDownDialogo}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleFondoClick}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <SlidersHorizontal size={20} aria-hidden="true" />
            </div>
            <div>
              <h3
                id="modal-cambiar-estado-titulo"
                className="text-base font-bold text-slate-900"
              >
                Cambiar Estado de Matrícula
              </h3>
              <p className="text-xs text-slate-500">
                {nombreCurso ?? matricula.nombreGrado} &bull; Año {matricula.anioLectivo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={estaCambiandoEstado}
            aria-label="Cerrar modal"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorCambioEstado && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">Error al cambiar estado</p>
                <p className="mt-0.5">{errorCambioEstado}</p>
              </div>
            </div>
          )}

          {/* Ficha Resumen del Estudiante */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="min-w-0 pr-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Estudiante
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                {matricula.nombreCompletoEstudiante}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Doc. {matricula.documentoEstudiante}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Estado Actual
              </p>
              <Badge color={COLOR_ESTADO[matricula.estado] ?? 'slate'}>
                {matricula.estado}
              </Badge>
            </div>
          </div>

          {/* Opciones de Nuevo Estado */}
          <div className="space-y-2">
            <label
              id="label-grupo-estados"
              className="block text-xs font-semibold text-slate-700"
            >
              Selecciona el nuevo estado <span className="text-red-500">*</span>
            </label>

            <div
              role="radiogroup"
              aria-labelledby="label-grupo-estados"
              className="space-y-2"
            >
              {OPCIONES_ESTADO_DESTINO.map((opcion) => {
                const esSeleccionado = nuevoEstado === opcion.estado
                const esElMismoEstado = matricula.estado === opcion.estado

                return (
                  <button
                    key={opcion.estado}
                    type="button"
                    role="radio"
                    aria-checked={esSeleccionado}
                    disabled={esElMismoEstado || estaCambiandoEstado}
                    onClick={() => handleSeleccionarOpcion(opcion.estado)}
                    className={`w-full text-left rounded-xl border p-3 transition flex items-start justify-between gap-3 ${
                      esElMismoEstado
                        ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                        : esSeleccionado
                          ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">
                          {opcion.titulo}
                        </span>
                        <Badge color={opcion.colorBadge}>
                          {opcion.estado}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {opcion.descripcion}
                      </p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center transition ${
                          esSeleccionado
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {esSeleccionado && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Advertencia Académica Institucional */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/75 p-3 text-xs text-amber-800">
            <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Aviso reglamentario:</strong> Los estados Retirada, Promovida y Reprobada son terminales. Una vez aplicado el cambio, la matrícula no podrá retornar a estado Activa.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onCerrar}
              disabled={estaCambiandoEstado}
              className="w-auto px-4 py-2 text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!esValido}
              className="w-auto px-4 py-2 text-xs font-semibold"
            >
              {estaCambiandoEstado ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  <span>Actualizando estado...</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal size={15} aria-hidden="true" />
                  <span>Confirmar cambio</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

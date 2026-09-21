import { X, AlertCircle, Calendar } from 'lucide-react'
import type { AnioLectivo } from '@/shared/types/anioLectivo.types'
import { useGestionPeriodos } from '../hooks/useGestionPeriodos'
import { PeriodoForm } from './PeriodoForm'
import { PeriodosTabla } from './PeriodosTabla'

interface PeriodosAnioModalProps {
  anio: AnioLectivo
  esActivo: boolean
  onCerrar: () => void
}

export function PeriodosAnioModal({ anio, esActivo, onCerrar }: PeriodosAnioModalProps) {
  const {
    periodos,
    isLoading,
    errorCarga,
    periodoEditando,
    form,
    setForm,
    errorForm,
    guardando,
    alternandoEstado,
    iniciarCrear,
    iniciarEditar,
    cancelarEdicion,
    alEnviarForm,
    alternarEstado,
  } = useGestionPeriodos(anio)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
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
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
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
            periodoEditando={periodoEditando}
            form={form}
            errorForm={errorForm}
            guardando={guardando}
            onFormChange={(valores) => setForm((prev) => ({ ...prev, ...valores }))}
            onCancelar={cancelarEdicion}
            onSubmit={alEnviarForm}
          />
        ) : (
          <PeriodosTabla
            periodos={periodos}
            isLoading={isLoading}
            errorCarga={errorCarga}
            esActivo={esActivo}
            alternandoEstado={alternandoEstado}
            onIniciarCrear={iniciarCrear}
            onIniciarEditar={iniciarEditar}
            onAlternarEstado={alternarEstado}
          />
        )}
      </div>
    </div>
  )
}

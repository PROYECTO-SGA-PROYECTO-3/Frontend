import { useState } from 'react'
import { X, UserRoundPen, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui'
import type { CargaAcademica } from '@/shared/types/academico.types'
import { useDocentesCandidatos, useReasignarDocente } from '../../hooks'

export interface ReasignarDocenteModalProps {
  abierto: boolean
  carga: CargaAcademica | null
  cursoId: number
  onCerrar: () => void
  onExito: (nombreAsignatura: string, nombreNuevoDocente: string) => void
}

export function ReasignarDocenteModal(props: ReasignarDocenteModalProps) {
  if (!props.abierto || !props.carga) return null
  return (
    <ReasignarDocenteDialog
      key={props.carga.id}
      {...props}
      carga={props.carga}
    />
  )
}

interface ReasignarDocenteDialogProps extends ReasignarDocenteModalProps {
  carga: CargaAcademica
}

function ReasignarDocenteDialog({
  carga,
  cursoId,
  onCerrar,
  onExito,
}: ReasignarDocenteDialogProps) {
  const [docenteIdSeleccionado, setDocenteIdSeleccionado] = useState<number | ''>(
    carga.docenteId,
  )

  const { docentes, isLoading: cargandoDocentes } = useDocentesCandidatos({
    enabled: true,
  })



  const {
    reasignarDocente,
    estaReasignando,
    errorReasignar,
    resetearError,
  } = useReasignarDocente(cursoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docenteIdSeleccionado || docenteIdSeleccionado === carga.docenteId) return

    try {
      await reasignarDocente({
        cargaId: carga.id,
        datos: { docenteId: Number(docenteIdSeleccionado) },
      })
      const nuevoDocente = docentes?.find((d) => d.id === Number(docenteIdSeleccionado))
      onExito(carga.nombreAsignatura, nuevoDocente?.nombreCompleto ?? 'Nuevo docente')
      onCerrar()
    } catch {
      // React Query expone el error en errorReasignar
    }
  }

  const handleKeyDownDialogo = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !estaReasignando) {
      e.stopPropagation()
      onCerrar()
    }
  }

  const handleFondoClick = () => {
    if (!estaReasignando) {
      onCerrar()
    }
  }

  const handleSeleccionarDocente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetearError()
    const valor = e.target.value
    setDocenteIdSeleccionado(valor ? Number(valor) : '')
  }

  const esDocenteDiferente =
    Boolean(docenteIdSeleccionado) && docenteIdSeleccionado !== carga.docenteId
  const formularioValido = esDocenteDiferente && !estaReasignando

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-reasignar-docente-titulo"
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
              <UserRoundPen size={20} aria-hidden="true" />
            </div>
            <div>
              <h3
                id="modal-reasignar-docente-titulo"
                className="text-base font-bold text-slate-900"
              >
                Reasignar Docente Titular
              </h3>
              <p className="text-xs text-slate-500">
                Materia: <span className="font-semibold text-slate-700">{carga.nombreAsignatura}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={estaReasignando}
            aria-label="Cerrar modal"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorReasignar && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">No se pudo reasignar el docente</p>
                <p className="mt-0.5">{errorReasignar}</p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Docente titular actual
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {carga.nombreDocente}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Documento: {carga.documentoDocente}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="select-nuevo-docente"
              className="block text-xs font-semibold text-slate-700"
            >
              Seleccionar nuevo docente titular <span className="text-red-500">*</span>
            </label>
            <select
              id="select-nuevo-docente"
              value={docenteIdSeleccionado}
              onChange={handleSeleccionarDocente}
              disabled={estaReasignando || cargandoDocentes}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-400 transition"
              required
            >
              <option value="">
                {cargandoDocentes ? 'Cargando docentes...' : 'Elige el nuevo docente...'}
              </option>
              {docentes?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombreCompleto} — Doc. {doc.documento} {doc.id === carga.docenteId ? '(Actual)' : ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              El nuevo docente asumirá la titularidad de las notas y planillas de esta materia.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onCerrar}
              disabled={estaReasignando}
              className="w-auto px-4 py-2 text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!formularioValido}
              className="w-auto px-4 py-2 text-xs font-semibold"
            >
              {estaReasignando ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  <span>Guardando reasignación...</span>
                </>
              ) : (
                <>
                  <UserRoundPen size={15} aria-hidden="true" />
                  <span>Reasignar docente</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

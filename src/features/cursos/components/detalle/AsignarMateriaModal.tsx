import { useState } from 'react'
import { X, BookPlus, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useCatalogoMaterias } from '@/features/materias'
import { useDocentesCandidatos, useAsignarMateria } from '../../hooks'

export interface AsignarMateriaModalProps {
  abierto: boolean
  cursoId: number
  nombreCurso?: string
  asignaturasYaAsignadasIds: number[]
  onCerrar: () => void
  onExito: (nombreAsignatura: string) => void
}

export function AsignarMateriaModal(props: AsignarMateriaModalProps) {
  if (!props.abierto) return null
  return <AsignarMateriaDialog {...props} />
}

function AsignarMateriaDialog({
  cursoId,
  nombreCurso,
  asignaturasYaAsignadasIds,
  onCerrar,
  onExito,
}: AsignarMateriaModalProps) {
  const [asignaturaIdSeleccionada, setAsignaturaIdSeleccionada] = useState<number | ''>('')
  const [docenteIdSeleccionado, setDocenteIdSeleccionado] = useState<number | ''>('')

  const { asignaturas, isLoading: cargandoMaterias } = useCatalogoMaterias()
  const { docentes, isLoading: cargandoDocentes } = useDocentesCandidatos({
    enabled: true,
  })


  const {
    asignarMateria,
    estaAsignando,
    errorAsignar,
    resetearError,
  } = useAsignarMateria(cursoId)

  const materiasDisponibles = asignaturas.map((m) => ({
    ...m,
    yaAsignada: asignaturasYaAsignadasIds.includes(m.id),
  }))

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!asignaturaIdSeleccionada || !docenteIdSeleccionado) return

    try {
      await asignarMateria({
        asignaturaId: Number(asignaturaIdSeleccionada),
        docenteId: Number(docenteIdSeleccionado),
      })
      const asignatura = asignaturas.find((a) => a.id === Number(asignaturaIdSeleccionada))
      onExito(asignatura?.nombre ?? 'Asignatura')
      onCerrar()
    } catch {
      // React Query expone el error en errorAsignar
    }
  }

  const handleKeyDownDialogo = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && !estaAsignando) {
      e.stopPropagation()
      onCerrar()
    }
  }

  const handleFondoClick = () => {
    if (!estaAsignando) {
      onCerrar()
    }
  }

  const handleSeleccionarMateria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetearError()
    const valor = e.target.value
    setAsignaturaIdSeleccionada(valor ? Number(valor) : '')
  }

  const handleSeleccionarDocente = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetearError()
    const valor = e.target.value
    setDocenteIdSeleccionado(valor ? Number(valor) : '')
  }

  const formularioValido =
    Boolean(asignaturaIdSeleccionada) && Boolean(docenteIdSeleccionado) && !estaAsignando

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-asignar-materia-titulo"
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
              <BookPlus size={20} aria-hidden="true" />
            </div>
            <div>
              <h3
                id="modal-asignar-materia-titulo"
                className="text-base font-bold text-slate-900"
              >
                Asignar Materia al Curso
              </h3>
              <p className="text-xs text-slate-500">
                {nombreCurso ? `Curso: ${nombreCurso}` : `Curso #${cursoId}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={estaAsignando}
            aria-label="Cerrar modal"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Alerta de error del servidor */}
          {errorAsignar && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-semibold">No se pudo realizar la asignación</p>
                <p className="mt-0.5">{errorAsignar}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="select-asignatura"
              className="block text-xs font-semibold text-slate-700"
            >
              Asignatura curricular <span className="text-red-500">*</span>
            </label>
            <select
              id="select-asignatura"
              value={asignaturaIdSeleccionada}
              onChange={handleSeleccionarMateria}
              disabled={estaAsignando || cargandoMaterias}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-400 transition"
              required
            >
              <option value="">
                {cargandoMaterias ? 'Cargando materias disponibles...' : 'Selecciona una asignatura...'}
              </option>
              {materiasDisponibles.map((mat) => (
                <option
                  key={mat.id}
                  value={mat.id}
                  disabled={mat.yaAsignada}
                >
                  {mat.nombre} {mat.yaAsignada ? '(Ya asignada a este curso)' : ''}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Solo se pueden vincular asignaturas que no estén activas en este curso.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="select-docente"
              className="block text-xs font-semibold text-slate-700"
            >
              Docente titular responsable <span className="text-red-500">*</span>
            </label>
            <select
              id="select-docente"
              value={docenteIdSeleccionado}
              onChange={handleSeleccionarDocente}
              disabled={estaAsignando || cargandoDocentes}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-xs focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-400 transition"
              required
            >
              <option value="">
                {cargandoDocentes ? 'Cargando directorio de docentes...' : 'Selecciona un docente...'}
              </option>
              {docentes?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.nombreCompleto} — Doc. {doc.documento}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              El docente tendrá acceso a la planilla y registro de calificaciones de esta materia.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onCerrar}
              disabled={estaAsignando}
              className="w-auto px-4 py-2 text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={!formularioValido}
              className="w-auto px-4 py-2 text-xs font-semibold"
            >
              {estaAsignando ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  <span>Asignando materia...</span>
                </>
              ) : (
                <>
                  <BookPlus size={15} aria-hidden="true" />
                  <span>Asignar materia</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

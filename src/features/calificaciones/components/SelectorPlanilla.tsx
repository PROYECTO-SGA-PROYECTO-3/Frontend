import { Download, Filter } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import type { CargaAcademica, Periodo } from '@/shared/types/academico.types'

const CLASE_SELECT =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

interface SelectorPlanillaProps {
  cargas: CargaAcademica[]
  periodos: Periodo[]
  cargaAcademicaId: number | ''
  periodoId: number | ''
  onCambiarCarga: (id: number | '') => void
  onCambiarPeriodo: (id: number | '') => void
  onDescargarPlantilla: () => void
  descargando: boolean
}

export function SelectorPlanilla({
  cargas,
  periodos,
  cargaAcademicaId,
  periodoId,
  onCambiarCarga,
  onCambiarPeriodo,
  onDescargarPlantilla,
  descargando,
}: SelectorPlanillaProps) {
  const puedeDescargar = cargaAcademicaId !== '' && periodoId !== '' && !descargando

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Filter size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">1. Descargar plantilla</h2>
          <p className="text-sm text-slate-500">
            Elige la asignatura/grado y el periodo para generar la plantilla con tus estudiantes.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="select-carga" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Asignatura y grado
          </label>
          <select
            id="select-carga"
            className={CLASE_SELECT}
            value={cargaAcademicaId}
            onChange={(evento) => onCambiarCarga(evento.target.value ? Number(evento.target.value) : '')}
          >
            <option value="">Selecciona una asignatura...</option>
            {cargas.map((carga) => (
              <option key={carga.id} value={carga.id}>
                {carga.nombreAsignatura} · {carga.nombreGrado}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="select-periodo" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Periodo académico
          </label>
          <select
            id="select-periodo"
            className={CLASE_SELECT}
            value={periodoId}
            onChange={(evento) => onCambiarPeriodo(evento.target.value ? Number(evento.target.value) : '')}
          >
            <option value="">Selecciona un periodo...</option>
            {periodos.map((periodo) => (
              <option key={periodo.id} value={periodo.id}>
                {periodo.nombre}
                {periodo.cerradoParaDocentes ? ' (cerrado)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 w-fit">
        <Button
          type="button"
          variant="secondary"
          onClick={onDescargarPlantilla}
          disabled={!puedeDescargar}
          isLoading={descargando}
        >
          <Download size={16} />
          Descargar Plantilla
        </Button>
      </div>
    </section>
  )
}

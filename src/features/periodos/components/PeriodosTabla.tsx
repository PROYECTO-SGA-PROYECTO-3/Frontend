import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ErrorState } from '@/shared/ui/ErrorState'
import type { Periodo } from '../types'
import { PeriodoFila } from './PeriodoFila'
import { PeriodosSkeleton } from './PeriodosSkeleton'

export interface PeriodosTablaProps {
  periodos: Periodo[]
  isLoading: boolean
  errorCarga: string | null
  esActivo: boolean
  alternandoEstado: boolean
  onReintentar?: () => void
  onIniciarCrear: () => void
  onIniciarEditar: (periodo: Periodo) => void
  onAlternarEstado: (periodo: Periodo) => void
  onSolicitarEliminar: (periodo: Periodo) => void
}

export function PeriodosTabla({
  periodos,
  isLoading,
  errorCarga,
  esActivo,
  alternandoEstado,
  onReintentar,
  onIniciarCrear,
  onIniciarEditar,
  onAlternarEstado,
  onSolicitarEliminar,
}: PeriodosTablaProps) {
  if (isLoading) {
    return <PeriodosSkeleton />
  }

  if (errorCarga) {
    return (
      <div className="mt-4">
        <ErrorState
          titulo="Error al cargar los periodos académicos"
          mensaje={errorCarga}
          onRetry={onReintentar}
          textoBoton="Reintentar carga"
          variant="card"
        />
      </div>
    )
  }

  if (periodos.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/30 p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <Calendar size={24} />
        </div>
        <p className="text-sm font-semibold text-slate-700">
          No hay periodos registrados para este año lectivo
        </p>
        <p className="mt-1 max-w-sm text-xs text-slate-400">
          {esActivo
            ? 'Crea el primer periodo académico para definir el calendario de evaluaciones.'
            : 'Este año lectivo no contó con periodos registrados.'}
        </p>
        {esActivo && (
          <div className="mt-4">
            <Button type="button" onClick={onIniciarCrear}>
              <Plus size={16} />
              Crear Primer Periodo
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {esActivo && (
        <div className="flex justify-end">
          <div className="w-auto">
            <Button type="button" onClick={onIniciarCrear}>
              <Plus size={16} />
              Nuevo Periodo
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Rango de Fechas</th>
                <th className="px-4 py-3">%</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {periodos.map((periodo) => (
                <PeriodoFila
                  key={periodo.id}
                  periodo={periodo}
                  esActivo={esActivo}
                  alternandoEstado={alternandoEstado}
                  onIniciarEditar={onIniciarEditar}
                  onAlternarEstado={onAlternarEstado}
                  onSolicitarEliminar={onSolicitarEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

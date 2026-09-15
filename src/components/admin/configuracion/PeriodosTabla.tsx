import { Plus, Pencil, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Periodo } from '@/types/periodo.types'

interface PeriodosTablaProps {
  periodos: Periodo[]
  isLoading: boolean
  errorCarga: string | null
  esActivo: boolean
  alternandoEstado: boolean
  onIniciarCrear: () => void
  onIniciarEditar: (periodo: Periodo) => void
  onAlternarEstado: (periodo: Periodo) => void
}

export function PeriodosTabla({
  periodos,
  isLoading,
  errorCarga,
  esActivo,
  alternandoEstado,
  onIniciarCrear,
  onIniciarEditar,
  onAlternarEstado,
}: PeriodosTablaProps) {
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
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : errorCarga ? (
          <p className="p-6 text-center text-sm text-red-600">{errorCarga}</p>
        ) : periodos.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No hay periodos registrados para este año lectivo.
          </p>
        ) : (
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
                  <tr key={periodo.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">{periodo.nombre}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {periodo.fechaInicio} — {periodo.fechaFin}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{periodo.porcentaje}%</td>
                    <td className="px-4 py-3">
                      <Badge color={periodo.cerradoParaDocentes ? 'red' : 'brand'}>
                        {periodo.cerradoParaDocentes ? 'Cerrado' : 'Abierto'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Editar ${periodo.nombre}`}
                          disabled={!esActivo}
                          onClick={() => onIniciarEditar(periodo)}
                          className="cursor-pointer rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          aria-label={
                            periodo.cerradoParaDocentes
                              ? `Reabrir ${periodo.nombre}`
                              : `Cerrar ${periodo.nombre}`
                          }
                          disabled={!esActivo || alternandoEstado}
                          onClick={() => onAlternarEstado(periodo)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition disabled:cursor-not-allowed disabled:text-slate-300"
                          title={
                            periodo.cerradoParaDocentes
                              ? 'Reabrir para docentes'
                              : 'Cerrar ingreso de notas'
                          }
                        >
                          {periodo.cerradoParaDocentes ? (
                            <Unlock size={15} className="text-brand-600" />
                          ) : (
                            <Lock size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

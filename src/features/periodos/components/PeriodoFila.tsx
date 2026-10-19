import { Pencil, Lock, Unlock, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import type { Periodo } from '../types'

export interface PeriodoFilaProps {
  periodo: Periodo
  esActivo: boolean
  alternandoEstado: boolean
  onIniciarEditar: (periodo: Periodo) => void
  onAlternarEstado: (periodo: Periodo) => void
  onSolicitarEliminar: (periodo: Periodo) => void
}

export function PeriodoFila({
  periodo,
  esActivo,
  alternandoEstado,
  onIniciarEditar,
  onAlternarEstado,
  onSolicitarEliminar,
}: PeriodoFilaProps) {
  const handleEditar = () => {
    onIniciarEditar(periodo)
  }

  const handleAlternarEstado = () => {
    onAlternarEstado(periodo)
  }

  const handleSolicitarEliminar = () => {
    onSolicitarEliminar(periodo)
  }

  const tituloAlternar = periodo.cerradoParaDocentes
    ? 'Reabrir para docentes'
    : 'Cerrar ingreso de notas'

  const tituloEliminar = !esActivo
    ? 'No se puede eliminar periodos en años históricos'
    : periodo.cerradoParaDocentes
      ? 'No se puede eliminar un periodo cerrado'
      : `Eliminar ${periodo.nombre}`

  return (
    <tr className="hover:bg-slate-50/50">
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
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Editar ${periodo.nombre}`}
            disabled={!esActivo}
            onClick={handleEditar}
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
            onClick={handleAlternarEstado}
            className="cursor-pointer rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition disabled:cursor-not-allowed disabled:text-slate-300"
            title={tituloAlternar}
          >
            {periodo.cerradoParaDocentes ? (
              <Unlock size={15} className="text-brand-600" />
            ) : (
              <Lock size={15} />
            )}
          </button>

          <button
            type="button"
            aria-label={`Eliminar ${periodo.nombre}`}
            disabled={!esActivo || periodo.cerradoParaDocentes}
            onClick={handleSolicitarEliminar}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:cursor-not-allowed disabled:text-slate-300"
            title={tituloEliminar}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

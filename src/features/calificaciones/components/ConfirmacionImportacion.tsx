import { FileCheck2, X } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import type { ResultadoPreviewImportacion } from '../types'

interface ConfirmacionImportacionProps {
  previsualizacion: ResultadoPreviewImportacion
  confirmando: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function ConfirmacionImportacion({
  previsualizacion,
  confirmando,
  onConfirmar,
  onCancelar,
}: ConfirmacionImportacionProps) {
  const { filas, totalCreaciones, totalActualizaciones } = previsualizacion

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <header className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <FileCheck2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Confirmar importación</h2>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{totalCreaciones}</span> nota(s) nueva(s) y{' '}
                <span className="font-semibold text-slate-800">{totalActualizaciones}</span> actualización(es).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            disabled={confirmando}
            aria-label="Cerrar modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-3.5">Estudiante</th>
                <th scope="col" className="px-6 py-3.5 text-center">Nota actual</th>
                <th scope="col" className="px-6 py-3.5 text-center">Nota nueva</th>
                <th scope="col" className="px-6 py-3.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filas.map((fila) => (
                <tr key={fila.documento} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-slate-900">{fila.nombreEstudiante}</p>
                    <p className="text-xs font-mono text-slate-400">{fila.documento}</p>
                  </td>
                  <td className="px-6 py-3.5 text-center text-slate-500">
                    {fila.notaActual !== null && fila.notaActual !== undefined ? fila.notaActual.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-center font-bold text-slate-900">
                    {fila.notaNueva.toFixed(1)}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Badge color={fila.actualizacion ? 'orange' : 'brand'}>
                      {fila.actualizacion ? 'Actualizar' : 'Nueva'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
          <div>
            <Button type="button" variant="secondary" onClick={onCancelar} disabled={confirmando}>
              Cancelar
            </Button>
          </div>
          <div>
            <Button type="button" isLoading={confirmando} onClick={onConfirmar}>
              Confirmar e Importar
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}

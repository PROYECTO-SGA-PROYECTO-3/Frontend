import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ErrorFilaImportacion, ResultadoImportacionNotas } from '../types'

interface ResultadoImportacionProps {
  resultado: ResultadoImportacionNotas | null
  errores: ErrorFilaImportacion[] | null
  mensajeError: string | null
}

export function ResultadoImportacion({
  resultado,
  errores,
  mensajeError,
}: ResultadoImportacionProps) {
  if (resultado) {
    return (
      <div
        role="status"
        className="flex items-start gap-3.5 rounded-2xl border border-brand-200 bg-brand-50/70 p-5 shadow-xs"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-900">Importación exitosa</h4>
          <p className="mt-0.5 text-sm text-brand-700">
            Se registraron <span className="font-semibold">{resultado.notasCreadas}</span> notas nuevas y se actualizaron{' '}
            <span className="font-semibold">{resultado.notasActualizadas}</span> notas existentes.
          </p>
        </div>
      </div>
    )
  }

  if (errores && errores.length > 0) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-900">Errores detectados en la plantilla</h4>
            <p className="mt-0.5 text-xs text-red-700">
              El archivo contiene {errores.length} {errores.length === 1 ? 'fila con inconsistencias' : 'filas con inconsistencias'}. No se guardó ninguna nota para proteger la integridad de los datos.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-red-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-red-50/50 text-xs font-semibold uppercase tracking-wider text-red-800 border-b border-red-100">
              <tr>
                <th scope="col" className="px-4 py-2.5">Fila</th>
                <th scope="col" className="px-4 py-2.5">Documento</th>
                <th scope="col" className="px-4 py-2.5">Descripción del error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100/60 font-mono text-xs">
              {errores.map((error, indice) => (
                <tr key={`${error.fila}-${indice}`} className="hover:bg-red-50/30">
                  <td className="px-4 py-2.5 font-bold text-slate-700">{error.fila}</td>
                  <td className="px-4 py-2.5 text-slate-600">{error.documento || '—'}</td>
                  <td className="px-4 py-2.5 text-red-600 font-sans">{error.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (mensajeError) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3.5 rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-xs"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-900">Error de procesamiento</h4>
          <p className="mt-0.5 text-xs text-red-700">{mensajeError}</p>
        </div>
      </div>
    )
  }

  return null
}

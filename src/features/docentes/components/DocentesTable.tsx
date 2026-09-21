import { Paginacion } from '@/shared/ui'
import { DocenteFila } from './DocenteFila'
import type { Docente } from '../types'

interface DocentesTableProps {
  docentes: Docente[]
  paginaActual: number
  totalPaginas: number
  totalElementos: number
  tamanoPagina: number
  onCambiarPagina: (nuevaPagina: number) => void
  onCambiarTamanoPagina?: (nuevoTamano: number) => void
  onEditar: (docente: Docente) => void
  onCambiarEstado: (docente: Docente) => void
  onEliminar: (docente: Docente) => void
}

export function DocentesTable({
  docentes,
  paginaActual,
  totalPaginas,
  totalElementos,
  tamanoPagina,
  onCambiarPagina,
  onCambiarTamanoPagina,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: DocentesTableProps) {

  const desde = totalElementos === 0 ? 0 : paginaActual * tamanoPagina + 1
  const hasta = Math.min(desde + docentes.length - 1, totalElementos)

  return (
    <div className="flex flex-col gap-4">
      {/* Contenedor de la tabla con scroll horizontal suave */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-5 py-3.5">
                  Docente
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Identificación
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Materias
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Firma Digital
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Estado
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {docentes.map((docente) => (
                <DocenteFila
                  key={docente.id}
                  docente={docente}
                  onEditar={onEditar}
                  onCambiarEstado={onCambiarEstado}
                  onEliminar={onEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie de tabla con información, selector de tamaño y paginación */}
      <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row px-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{desde}</span> a{' '}
            <span className="font-semibold text-slate-700">{hasta}</span> de{' '}
            <span className="font-semibold text-slate-700">{totalElementos}</span> docentes
          </p>

          {onCambiarTamanoPagina && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 border-l border-slate-200 pl-3">
              <span>Mostrar:</span>
              <select
                value={tamanoPagina}
                onChange={(e) => {
                  onCambiarTamanoPagina(Number(e.target.value))
                  onCambiarPagina(0)
                }}
                aria-label="Cantidad de docentes por página"
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
              </select>
            </div>
          )}
        </div>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={onCambiarPagina}
        />
      </footer>
    </div>
  )
}


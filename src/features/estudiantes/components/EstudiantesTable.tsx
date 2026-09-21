import { Loader2 } from 'lucide-react'
import { Paginacion } from '@/shared/ui'
import { EstudianteFila } from './EstudianteFila'
import type { Estudiante } from '../types'

interface EstudiantesTableProps {
  estudiantes: Estudiante[]
  paginaActual: number
  totalPaginas: number
  totalElementos: number
  tamanoPagina: number
  isFetching?: boolean
  onCambiarPagina: (nuevaPagina: number) => void
  onCambiarTamanoPagina?: (nuevoTamano: number) => void
  onVerPerfil: (estudiante: Estudiante) => void
  onEditar: (estudiante: Estudiante) => void
  onCambiarEstado: (estudiante: Estudiante) => void
  onEliminar: (estudiante: Estudiante) => void
}

export function EstudiantesTable({
  estudiantes,
  paginaActual,
  totalPaginas,
  totalElementos,
  tamanoPagina,
  isFetching = false,
  onCambiarPagina,
  onCambiarTamanoPagina,
  onVerPerfil,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: EstudiantesTableProps) {
  // Cálculo exacto y libre de índices negativos para paginación de backend
  const desde = totalElementos === 0 ? 0 : paginaActual * tamanoPagina + 1
  const hasta =
    totalElementos === 0
      ? 0
      : Math.min(paginaActual * tamanoPagina + estudiantes.length, totalElementos)

  return (
    <div className="flex flex-col gap-4">
      {/* Contenedor de la tabla con scroll horizontal y efecto sutil durante recargas del servidor */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {isFetching && (
          <div className="absolute top-2 right-4 z-10 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs text-white shadow-md animate-in fade-in duration-200">
            <Loader2 size={12} className="animate-spin" />
            <span>Sincronizando...</span>
          </div>
        )}

        <div className={`overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-5 py-3.5">
                  Estudiante
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Identificación
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Curso / Matrícula
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
              {estudiantes.map((estudiante) => (
                <EstudianteFila
                  key={estudiante.id}
                  estudiante={estudiante}
                  onVerPerfil={onVerPerfil}
                  onEditar={onEditar}
                  onCambiarEstado={onCambiarEstado}
                  onEliminar={onEliminar}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie de tabla con información, selector de tamaño y paginación conectada al servidor */}
      <footer className="flex flex-col items-center justify-between gap-3 sm:flex-row px-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-slate-500">
            Mostrando <span className="font-semibold text-slate-700">{desde}</span> a{' '}
            <span className="font-semibold text-slate-700">{hasta}</span> de{' '}
            <span className="font-semibold text-slate-700">{totalElementos}</span> estudiantes
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
                aria-label="Cantidad de estudiantes por página"
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-1 focus:ring-brand-600 cursor-pointer"
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
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

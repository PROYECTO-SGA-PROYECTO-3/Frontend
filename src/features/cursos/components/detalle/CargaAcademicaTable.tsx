import type { CargaAcademica } from '@/shared/types/academico.types'
import { CargaAcademicaFila } from './CargaAcademicaFila'

export interface CargaAcademicaTableProps {
  cargas: CargaAcademica[]
  onReasignarDocente?: (carga: CargaAcademica) => void
  onRemoverMateria?: (carga: CargaAcademica) => void
}

export function CargaAcademicaTable({
  cargas,
  onReasignarDocente,
  onRemoverMateria,
}: CargaAcademicaTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          aria-label="Listado de asignaturas y carga académica de este curso"
        >
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th scope="col" className="w-12 py-3.5 pl-4 pr-2 text-center sm:pl-6">
                #
              </th>
              <th scope="col" className="py-3.5 px-4">
                Asignatura
              </th>
              <th scope="col" className="py-3.5 px-4">
                Docente Titular
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right">
                Acciones
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cargas.map((carga, index) => (
              <CargaAcademicaFila
                key={carga.id}
                carga={carga}
                indice={index + 1}
                onReasignarDocente={onReasignarDocente}
                onRemoverMateria={onRemoverMateria}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen al pie de la tabla */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:px-6">
        <span>
          Mostrando {cargas.length} materia{cargas.length === 1 ? '' : 's'} asignada{cargas.length === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}

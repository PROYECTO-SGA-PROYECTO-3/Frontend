import type { Matricula } from '@/shared/types/matricula.types'
import { EstudianteMatriculadoFila } from './EstudianteMatriculadoFila'

export interface EstudiantesMatriculadosTableProps {
  estudiantes: Matricula[]
}

export function EstudiantesMatriculadosTable({
  estudiantes,
}: EstudiantesMatriculadosTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-sm"
          aria-label="Listado de estudiantes matriculados en este curso"
        >
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th scope="col" className="w-12 py-3.5 pl-4 pr-2 text-center sm:pl-6">
                #
              </th>
              <th scope="col" className="py-3.5 px-4">
                Estudiante
              </th>
              <th scope="col" className="py-3.5 px-4">
                Documento
              </th>
              <th scope="col" className="py-3.5 px-4 text-center">
                Año Lectivo
              </th>
              <th scope="col" className="py-3.5 pl-4 pr-6 text-right">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {estudiantes.map((matricula, index) => (
              <EstudianteMatriculadoFila
                key={matricula.id}
                matricula={matricula}
                indice={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen al pie de la tabla */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:px-6">
        <span>
          Mostrando {estudiantes.length} estudiante{estudiantes.length === 1 ? '' : 's'} matriculado{estudiantes.length === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}

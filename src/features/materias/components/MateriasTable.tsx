import { MateriaFila } from './MateriaFila'
import type { Asignatura } from '../types'

interface MateriasTableProps {
  materias: Asignatura[]
  onEditar: (materia: Asignatura) => void
  onEliminar: (materia: Asignatura) => void
}

export function MateriasTable({ materias, onEditar, onEliminar }: MateriasTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="w-16 px-6 py-3.5 text-center">
                #
              </th>
              <th scope="col" className="w-28 px-4 py-3.5">
                Código
              </th>
              <th scope="col" className="px-6 py-3.5">
                Asignatura
              </th>
              <th scope="col" className="w-32 px-4 py-3.5 text-center">
                Estado
              </th>
              <th scope="col" className="w-28 px-6 py-3.5 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {materias.map((materia, index) => (
              <MateriaFila
                key={materia.id}
                materia={materia}
                indice={index}
                onEditar={onEditar}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla con conteo */}
      <div className="border-t border-slate-100 bg-slate-50/40 px-6 py-3 text-xs text-slate-500">
        Mostrando <span className="font-semibold text-slate-700">{materias.length}</span>{' '}
        {materias.length === 1 ? 'asignatura' : 'asignaturas'} en el catálogo
      </div>
    </div>
  )
}

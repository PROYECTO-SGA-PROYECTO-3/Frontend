import type { Grado } from '@/shared/types/academico.types'
import { CursoFila } from './CursoFila'

interface CursosTableProps {
  cursos: Grado[]
  onEditar: (curso: Grado) => void
  onEliminar: (curso: Grado) => void
}

export function CursosTable({ cursos, onEditar, onEliminar }: CursosTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" aria-label="Catálogo institucional de grados escolares">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th scope="col" className="w-12 py-3.5 pl-4 pr-2 text-center sm:pl-6">
                #
              </th>
              <th scope="col" className="py-3.5 px-3">
                Curso / Grado
              </th>
              <th scope="col" className="py-3.5 px-3">
                Director de Grupo
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-4 text-right sm:pr-6">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cursos.map((curso, index) => (
              <CursoFila
                key={curso.id}
                curso={curso}
                indice={index + 1}
                onEditar={onEditar}
                onEliminar={onEliminar}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pie de tabla con resumen */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:px-6">
        <span>Mostrando {cursos.length} curso{cursos.length === 1 ? '' : 's'} en el catálogo</span>
      </div>
    </div>
  )
}

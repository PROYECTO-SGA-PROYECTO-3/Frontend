import { Calendar } from 'lucide-react'
import type { Matricula, EstadoMatricula } from '@/shared/types/matricula.types'
import { Avatar, Badge, type BadgeColor } from '@/shared/ui'

export interface EstudiantesMatriculadosTableProps {
  estudiantes: Matricula[]
}

const COLOR_ESTADO: Record<EstadoMatricula, BadgeColor> = {
  ACTIVA: 'brand',
  RETIRADA: 'red',
  PROMOVIDA: 'blue',
  REPROBADA: 'orange',
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
            {estudiantes.map((matricula, index) => {
              const colorBadge = COLOR_ESTADO[matricula.estado] ?? 'slate'

              return (
                <tr
                  key={matricula.id}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  {/* Correlativo */}
                  <td className="w-12 py-3.5 pl-4 pr-2 text-center text-xs font-semibold text-slate-400 sm:pl-6">
                    {index + 1}
                  </td>

                  {/* Estudiante (Avatar + Nombre + ID) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        nombre={matricula.nombreCompletoEstudiante}
                        tamano="sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {matricula.nombreCompletoEstudiante}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID Alumno #{matricula.estudianteId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Documento de Identidad */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
                      {matricula.documentoEstudiante}
                    </span>
                  </td>

                  {/* Año Lectivo */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Calendar size={13} className="text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{matricula.anioLectivo}</span>
                    </span>
                  </td>

                  {/* Estado de Matrícula */}
                  <td className="py-3.5 pl-4 pr-6 text-right">
                    <Badge color={colorBadge}>
                      {matricula.estado}
                    </Badge>
                  </td>
                </tr>
              )
            })}
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

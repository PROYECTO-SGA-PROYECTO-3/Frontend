import { ClipboardList, Users } from 'lucide-react'
import { cn, estiloNotaFinal } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/Skeleton'
import type { Nota } from '../types'

interface TablaNotasPlanillaProps {
  notas: Nota[]
  isLoading?: boolean
}

export function TablaNotasPlanilla({ notas, isLoading = false }: TablaNotasPlanillaProps) {
  if (isLoading) {
    return (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 bg-slate-50/60 p-6">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </header>
        <div className="divide-y divide-slate-100 p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 pt-3 first:pt-0">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-7 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </article>
    )
  }

  if (notas.length === 0) {
    return null
  }

  const calificados = notas.filter((n) => n.valor !== null && n.valor !== undefined).length

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ClipboardList size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Planilla de estudiantes del curso</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {calificados} de {notas.length} estudiantes con nota registrada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600">
          <Users size={15} className="text-slate-400" />
          <span>{notas.length} matriculados</span>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold tracking-wide uppercase text-slate-500">
              <th scope="col" className="px-6 py-3.5">Documento</th>
              <th scope="col" className="px-6 py-3.5">Estudiante</th>
              <th scope="col" className="px-6 py-3.5 text-center">Calificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notas.map((nota) => (
              <tr
                key={nota.id ?? `matricula-${nota.matriculaId}`}
                className="transition-colors hover:bg-slate-50/60"
              >
                <td className="px-6 py-3.5 text-sm text-slate-600 font-mono">
                  {nota.documentoEstudiante}
                </td>
                <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                  {nota.nombreEstudiante}
                </td>
                <td className="px-6 py-3.5 text-center">
                  {nota.valor !== null && nota.valor !== undefined ? (
                    <span
                      className={cn(
                        'inline-flex min-w-14 items-center justify-center rounded-lg border px-3 py-1 text-sm font-bold shadow-2xs',
                        estiloNotaFinal(nota.valor),
                      )}
                    >
                      {nota.valor.toFixed(1)}
                    </span>
                  ) : (
                    <span className="inline-flex min-w-14 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400">
                      Sin calificar
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

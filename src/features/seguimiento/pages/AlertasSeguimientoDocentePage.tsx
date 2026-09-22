import { Link } from 'react-router-dom'
import { AlertOctagon, ArrowLeft, GraduationCap } from 'lucide-react'
import { PageHeader } from '@/layouts'
import { Avatar } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'
import { Skeleton } from '@/shared/ui/Skeleton'
import { ErrorState } from '@/shared/ui/ErrorState'
import { extraerMensajeError } from '@/shared/lib/axios'
import { useAlertasSeguimientoDocente } from '../hooks/useAlertasSeguimientoDocente'

export function AlertasSeguimientoDocentePage() {
  const { data: estudiantes = [], isLoading, isError, error, refetch } = useAlertasSeguimientoDocente()

  return (
    <>
      <PageHeader raiz="Portal Docente" seccionActual="Alertas de Seguimiento" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Link
          to="/docente"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        <section className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-xs">
              <AlertOctagon size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alertas de Seguimiento</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Estudiantes con promedio bajo el umbral de rendimiento institucional (3.0).
              </p>
            </div>
          </div>

          {!isLoading && !isError && estudiantes.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 shadow-xs">
              <GraduationCap size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">
                {estudiantes.length} {estudiantes.length === 1 ? 'caso activo' : 'casos activos'}
              </span>
            </div>
          )}
        </section>

        <div className="mt-6">
          {isError ? (
            <ErrorState
              titulo="Error al cargar las alertas de seguimiento"
              mensaje={extraerMensajeError(error)}
              onRetry={() => refetch()}
            />
          ) : isLoading ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="divide-y divide-slate-100 p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between gap-4 pt-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ) : estudiantes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <GraduationCap size={24} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Sin alertas pendientes</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                ¡Excelente! Actualmente todos tus alumnos superan el umbral mínimo de rendimiento.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th scope="col" className="px-6 py-3.5">Estudiante</th>
                      <th scope="col" className="px-6 py-3.5">Grado</th>
                      <th scope="col" className="px-6 py-3.5">Asignatura</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Promedio Actual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {estudiantes.map((estudiante) => (
                      <tr
                        key={`${estudiante.estudianteId}-${estudiante.nombreAsignatura}`}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar nombre={estudiante.nombreCompleto} />
                            <span className="font-semibold text-slate-900">{estudiante.nombreCompleto}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{estudiante.gradoNombre}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{estudiante.nombreAsignatura}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge color="orange">
                            Bajo Rendimiento · {estudiante.promedio.toFixed(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}



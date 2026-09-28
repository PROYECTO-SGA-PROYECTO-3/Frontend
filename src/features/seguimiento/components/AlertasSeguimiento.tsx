import { AlertOctagon, AlertTriangle } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import type { EstudianteBajoRendimiento } from '../types'

interface AlertasSeguimientoProps {
  estudiantes: EstudianteBajoRendimiento[]
  onVerReporteCompleto: () => void
  planillasPendientes?: number
  onSubirNotas?: () => void
}

export function AlertasSeguimiento({
  estudiantes,
  onVerReporteCompleto,
  planillasPendientes = 0,
  onSubirNotas,
}: AlertasSeguimientoProps) {
  return (
    <section aria-labelledby="alertas-seguimiento-titulo" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <AlertOctagon size={18} />
        </div>
        <h3 id="alertas-seguimiento-titulo" className="text-lg font-bold text-slate-900">
          Alertas de Seguimiento
        </h3>
      </div>

      {planillasPendientes > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-accent-100/60 p-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <AlertTriangle size={18} className="shrink-0 text-accent-600" />
            <p className="truncate text-xs font-medium text-slate-700">
              Faltan subir calificaciones en{' '}
              <span className="font-semibold text-slate-900">
                {planillasPendientes} {planillasPendientes === 1 ? 'planilla' : 'planillas'}
              </span>
            </p>
          </div>
          {onSubirNotas && (
            <Button
              type="button"
              variant="secondary"
              onClick={onSubirNotas}
              className="h-8 w-auto shrink-0 px-3 text-xs font-semibold whitespace-nowrap"
            >
              Subir notas
            </Button>
          )}
        </div>
      )}

      {estudiantes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No hay estudiantes en seguimiento por ahora.</p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-slate-100">
          {estudiantes.map((estudiante) => (
            <li
              key={`${estudiante.estudianteId}-${estudiante.nombreAsignatura}`}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar nombre={estudiante.nombreCompleto} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{estudiante.nombreCompleto}</p>
                <p className="truncate text-xs text-slate-500">
                  {estudiante.gradoNombre} · {estudiante.nombreAsignatura}
                </p>
              </div>
              <Badge color="orange">Bajo Rendimiento · {estudiante.promedio.toFixed(1)}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 w-full">
        <Button type="button" variant="secondary" onClick={onVerReporteCompleto}>
          Ver reporte completo
        </Button>
      </div>
    </section>
  )
}

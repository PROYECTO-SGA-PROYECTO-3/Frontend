import { Calendar, Plus } from 'lucide-react'
import { Can } from '@/features/auth'
import { Button } from '@/shared/ui'

export interface EventosEmptyStateProps {
  puedeCrear?: boolean
  onCrear?: () => void
}

export function EventosEmptyState({
  puedeCrear = false,
  onCrear,
}: EventosEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white py-16 px-6 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-600/10 mb-4">
        <Calendar size={32} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No hay eventos institucionales</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
        Actualmente no hay actividades ni eventos programados en el calendario institucional.
      </p>
      {puedeCrear && onCrear && (
        <Can roles={['ADMIN']}>
          <div className="mt-6">
            <Button onClick={onCrear}>
              <Plus size={18} aria-hidden="true" />
              Crear primer evento
            </Button>
          </div>
        </Can>
      )}
    </div>
  )
}

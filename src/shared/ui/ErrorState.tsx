import { AlertTriangle, RotateCcw } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Button } from './Button'

export interface ErrorStateProps {
  titulo?: string
  mensaje?: string | null
  onRetry?: () => void
  textoBoton?: string
  variant?: 'card' | 'inline'
  className?: string
}

export function ErrorState({
  titulo = 'Error al cargar los datos',
  mensaje,
  onRetry,
  textoBoton = 'Reintentar carga',
  variant = 'card',
  className,
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50/60 p-4 text-left shadow-xs sm:flex-row sm:items-center sm:justify-between',
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <h4 className="text-sm font-semibold text-red-900">{titulo}</h4>
            {mensaje && <p className="mt-0.5 text-xs text-red-700">{mensaje}</p>}
          </div>
        </div>

        {onRetry && (
          <div className="shrink-0 self-end sm:self-center">
            <Button
              variant="secondary"
              onClick={onRetry}
              className="w-auto px-3 py-1.5 text-xs"
            >
              <RotateCcw size={14} />
              {textoBoton}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center shadow-xs sm:p-10',
        className,
      )}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200/60 bg-red-100/80 text-red-600">
        <AlertTriangle size={26} />
      </div>

      <h3 className="text-base font-bold text-red-900">{titulo}</h3>

      {mensaje && (
        <p className="mt-1 max-w-md text-sm text-red-700 wrap-break-word">{mensaje}</p>
      )}

      {onRetry && (
        <div className="mt-5">
          <Button variant="secondary" onClick={onRetry} className="w-auto">
            <RotateCcw size={16} />
            {textoBoton}
          </Button>
        </div>
      )}
    </div>
  )
}

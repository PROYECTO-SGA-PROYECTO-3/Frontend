import { MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { IconoClima } from './IconoClima'
import { cn } from '@/lib/utils'

interface ClimaBadgeProps {
  onClick?: () => void
  className?: string
}

export function ClimaBadge({ onClick, className }: ClimaBadgeProps) {
  const { clima, ubicacionActual, cargando, actualizando, error, refrescar } = useWeather()

  if (cargando) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 animate-pulse',
          className,
        )}
      >
        <span className="h-2 w-2 rounded-full bg-slate-300" />
        <span>Cargando clima...</span>
      </div>
    )
  }

  if (error || !clima) {
    return (
      <button
        type="button"
        onClick={() => refrescar()}
        title={error ?? 'Error de clima. Clic para reintentar'}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100',
          className,
        )}
      >
        <AlertCircle size={14} />
        <span>Clima no disponible</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex cursor-pointer items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 text-xs font-medium shadow-2xs transition hover:border-brand-300 hover:bg-brand-50/50',
        className,
      )}
      title={`${clima.actual.condicion.descripcion} en ${ubicacionActual.name}. Clic para ver pronóstico completo`}
    >
      <div className="flex items-center gap-1.5 text-amber-500">
        <IconoClima
          nombre={clima.actual.condicion.icono}
          className="h-4 w-4 text-amber-600 transition group-hover:scale-110"
        />
        <span className="font-bold text-slate-800">{clima.actual.temperatura}°C</span>
      </div>

      <div className="h-3 w-px bg-slate-200" />

      <div className="flex items-center gap-1 text-slate-500">
        <MapPin size={12} className="text-slate-400" />
        <span className="max-w-24 truncate">{ubicacionActual.name}</span>
      </div>

      <RefreshCw
        size={12}
        className={cn(
          'text-slate-300 transition-transform group-hover:text-brand-500',
          actualizando && 'animate-spin text-brand-500',
        )}
      />
    </button>
  )
}

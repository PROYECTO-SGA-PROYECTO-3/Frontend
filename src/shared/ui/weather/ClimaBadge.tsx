import { useState, useRef, useEffect } from 'react'
import { MapPin, RefreshCw, AlertCircle, Navigation, Info, X } from 'lucide-react'
import { useWeather } from '@/shared/hooks/useWeather'
import { IconoClima } from './IconoClima'
import { Skeleton } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface ClimaBadgeProps {
  className?: string
}

/**
 * Badge informativo del clima para el SGA con feedback visual interactivo y accesible.
 * Comunica al usuario el estado del clima, si es tiempo real o respaldo institucional,
 * y muestra mensajes contextuales claros si la geolocalización fue denegada o falló.
 */
export function ClimaBadge({ className }: ClimaBadgeProps) {
  const {
    clima,
    ubicacion,
    cargando,
    actualizando,
    error,
    errorUbicacion,
    esTiempoReal,
    refrescar,
    solicitarUbicacionEnTiempoReal,
  } = useWeather()

  // Estado para el popover/tarjeta informativa de estado del clima
  const [mostrarDetalle, setMostrarDetalle] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target as Node)) {
        setMostrarDetalle(false)
      }
    }
    if (mostrarDetalle) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mostrarDetalle])

  // Estado de carga con Skeleton exacto (cero layout shift)
  if (cargando) {
    return (
      <div
        aria-label="Cargando información meteorológica"
        className={cn(
          'flex h-8 w-44 items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/50 px-3',
          className,
        )}
      >
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-10 rounded-sm" />
        <span className="h-3 w-px bg-slate-200" aria-hidden="true" />
        <Skeleton className="h-3 w-16 rounded-sm" />
      </div>
    )
  }

  // Estado de error crítico de red: feedback claro y accionable para el usuario
  if (error || !clima) {
    return (
      <button
        type="button"
        onClick={() => refrescar()}
        title={error ? `Error: ${error}. Clic para reintentar.` : 'No se pudo cargar el clima. Clic para reintentar.'}
        aria-label="Reintentar cargar información del clima"
        className={cn(
          'group flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/60 px-3 text-xs font-medium text-rose-700 shadow-2xs transition-colors hover:bg-rose-100/70 focus-visible:outline-2 focus-visible:outline-rose-600',
          className,
        )}
      >
        <AlertCircle size={13} className="text-rose-600 shrink-0" aria-hidden="true" />
        <span>Clima no disponible</span>
        <RefreshCw size={11} className="text-rose-500 group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
      </button>
    )
  }

  const { actual } = clima

  return (
    <div ref={contenedorRef} className="relative inline-flex items-center">
      {/* Badge Principal */}
      <div
        className={cn(
          'group flex h-8 items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-3 text-xs shadow-2xs backdrop-blur-xs transition-colors hover:border-slate-300',
          className,
        )}
      >
        {/* Disparador de detalle contextual para el usuario */}
        <button
          type="button"
          onClick={() => setMostrarDetalle((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-brand-600 rounded-full"
          aria-expanded={mostrarDetalle}
          aria-label={`Ver información detallada del clima: ${actual.temperatura}°C en ${ubicacion.municipio}`}
        >
          {/* Indicador de temperatura e icono */}
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <IconoClima
              nombre={actual.condicion.icono}
              className="h-4 w-4 text-accent-500 shrink-0"
              aria-hidden="true"
            />
            <span>{actual.temperatura}°C</span>
          </div>

          {/* Separador */}
          <span className="h-3 w-px bg-slate-200" aria-hidden="true" />

          {/* Ubicación y Tipo */}
          <div className="flex items-center gap-1 text-slate-500 font-medium max-w-28 truncate">
            {esTiempoReal ? (
              <Navigation size={11} className="text-brand-600 shrink-0" aria-hidden="true" />
            ) : (
              <MapPin size={11} className="text-slate-400 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{ubicacion.municipio}</span>
          </div>
        </button>

        {/* Botón interactivo: solicitar GPS si no está activo, o refrescar */}
        <button
          type="button"
          onClick={() => {
            if (!esTiempoReal) {
              solicitarUbicacionEnTiempoReal()
            } else {
              refrescar()
            }
          }}
          disabled={actualizando}
          aria-label={esTiempoReal ? 'Actualizar clima actual' : 'Activar ubicación en tiempo real'}
          title={esTiempoReal ? 'Actualizar estado del clima' : 'Activar clima de mi ubicación GPS actual'}
          className="cursor-pointer rounded-full p-0.5 text-slate-400 transition hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-brand-600 disabled:pointer-events-none"
        >
          <RefreshCw
            size={11}
            className={cn('transition-transform duration-500', actualizando && 'animate-spin text-brand-600')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Popover flotante informativo para el usuario final */}
      {mostrarDetalle && (
        <div
          role="dialog"
          aria-label="Detalle del clima"
          className="absolute right-0 top-10 z-50 w-72 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <IconoClima nombre={actual.condicion.icono} className="h-5 w-5 text-accent-500" />
              <span>{actual.condicion.descripcion}</span>
            </div>
            <button
              type="button"
              onClick={() => setMostrarDetalle(false)}
              aria-label="Cerrar detalle"
              className="cursor-pointer rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>

          <div className="mt-2.5 flex items-baseline justify-between border-b border-slate-100 pb-2.5">
            <div>
              <span className="text-2xl font-extrabold text-slate-800">{actual.temperatura}°C</span>
              <span className="ml-2 text-xs text-slate-500">Sensación {actual.sensacionTermica}°C</span>
            </div>
            <span className="text-xs text-slate-400">Humedad {actual.humedadRelativa}%</span>
          </div>

          {/* Estado de ubicación explicado para el usuario */}
          <div className="mt-2.5 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              {esTiempoReal ? (
                <>
                  <Navigation size={12} className="text-brand-600 shrink-0" />
                  <span>Tu ubicación actual ({ubicacion.municipio})</span>
                </>
              ) : (
                <>
                  <MapPin size={12} className="text-slate-500 shrink-0" />
                  <span>Sede Institucional: {ubicacion.municipio} ({ubicacion.departamento})</span>
                </>
              )}
            </div>

            {/* Aviso informativo claro si la geolocalización no se pudo activar */}
            {errorUbicacion && !esTiempoReal ? (
              <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800 border border-amber-200/70">
                <Info size={13} className="shrink-0 mt-0.5 text-amber-600" />
                <p>
                  {errorUbicacion}. Mostrando el clima oficial de la institución.
                </p>
              </div>
            ) : !esTiempoReal ? (
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Estás viendo el clima de la sede oficial. Pulsa el botón de actualizar para consultar el clima de tu posición GPS.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

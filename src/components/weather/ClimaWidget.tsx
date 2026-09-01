import { useState, useEffect, useRef } from 'react'
import {
  Search,
  MapPin,
  RefreshCw,
  Wind,
  Droplets,
  CloudRain,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Building2,
  Navigation,
  Calendar,
  Clock,
} from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { IconoClima } from './IconoClima'
import type { UbicacionGeo } from '@/types/weather.types'
import { cn } from '@/lib/utils'

export function ClimaWidget() {
  const {
    clima,
    ubicacionActual,
    cargando,
    actualizando,
    error,
    mensajeGps,
    obteniendoGps,
    refrescar,
    cambiarUbicacion,
    buscarUbicaciones,
    restablecerPredeterminada,
    obtenerUbicacionGPS,
    esInstitucion,
  } = useWeather()

  // Estado del buscador de ubicaciones
  const [busqueda, setBusqueda] = useState('')
  const [resultadosBusqueda, setResultadosBusqueda] = useState<UbicacionGeo[]>([])
  const [buscando, setBuscando] = useState(false)
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [tabActiva, setTabActiva] = useState<'horas' | 'dias'>('horas')

  const contenedorBusquedaRef = useRef<HTMLDivElement>(null)

  // Cerrar desplegable de búsqueda al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contenedorBusquedaRef.current &&
        !contenedorBusquedaRef.current.contains(event.target as Node)
      ) {
        setMostrarResultados(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce para búsqueda de municipios
  useEffect(() => {
    if (busqueda.trim().length < 2) {
      setResultadosBusqueda([])
      return
    }

    const timer = setTimeout(async () => {
      setBuscando(true)
      try {
        const res = await buscarUbicaciones(busqueda)
        setResultadosBusqueda(res)
        setMostrarResultados(true)
      } catch {
        setResultadosBusqueda([])
      } finally {
        setBuscando(false)
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [busqueda, buscarUbicaciones])

  // Helper para recomendación agropecuaria y escolar
  const obtenerRecomendacionAgricola = () => {
    if (!clima) return null

    const probLluvia = clima.porDias[0]?.probabilidadPrecipitacionMax ?? 0
    const uv = clima.actual.indiceUv ?? 0
    const temp = clima.actual.temperatura
    const viento = clima.actual.velocidadViento

    if (probLluvia >= 70 || clima.actual.codigoClima >= 95) {
      return {
        tipo: 'alerta',
        titulo: 'Alerta por Precipitaciones / Tormenta',
        mensaje:
          'Alta probabilidad de lluvias intensas. Se sugiere suspender labores en parcelas agrícolas abiertas y resguardar herramientas.',
        icono: AlertTriangle,
        claseContenedor: 'bg-rose-50 border-rose-200 text-rose-800',
        claseIcono: 'text-rose-600',
      }
    }

    if (uv >= 8) {
      return {
        tipo: 'precaucion',
        titulo: 'Radiación Solar Muy Alta (UV ' + uv + ')',
        mensaje:
          'Uso obligatorio de sombrero, protector solar e hidratación constante en actividades de campo y granja escolar.',
        icono: AlertTriangle,
        claseContenedor: 'bg-amber-50 border-amber-200 text-amber-900',
        claseIcono: 'text-amber-600',
      }
    }

    if (viento > 35) {
      return {
        tipo: 'precaucion',
        titulo: 'Vientos Fuertes (' + viento + ' km/h)',
        mensaje: 'Precaución en invernaderos, techados ligeros y fumigación foliar en cultivos.',
        icono: Wind,
        claseContenedor: 'bg-sky-50 border-sky-200 text-sky-800',
        claseIcono: 'text-sky-600',
      }
    }

    return {
      tipo: 'optimo',
      titulo: 'Condiciones Agroclimáticas Favorables',
      mensaje: `Temperatura óptima (${temp}°C) y humedad adecuada (${clima.actual.humedadRelativa}%) para prácticas agrícolas y académicas al aire libre.`,
      icono: CheckCircle2,
      claseContenedor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      claseIcono: 'text-emerald-600',
    }
  }

  const recomendacion = obtenerRecomendacionAgricola()

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition">
      {/* Barra superior de control y búsqueda */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Estación Meteorológica Escolar</h3>
              {esInstitucion && (
                <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                  Sede Oficial
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Datos satelitales en tiempo real vía Open-Meteo
            </p>
          </div>
        </div>

        {/* Buscador y botones de geolocalización */}
        <div className="flex flex-wrap items-center gap-2">
          <div ref={contenedorBusquedaRef} className="relative min-w-[200px] flex-1 sm:w-64 sm:flex-initial">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onFocus={() => {
                  if (resultadosBusqueda.length > 0) setMostrarResultados(true)
                }}
                placeholder="Buscar municipio / ciudad..."
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 transition focus:border-brand-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
              {buscando && (
                <RefreshCw
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-slate-400"
                />
              )}
            </div>

            {/* Dropdown de resultados */}
            {mostrarResultados && resultadosBusqueda.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {resultadosBusqueda.map((loc) => (
                  <button
                    key={`${loc.id}-${loc.latitude}`}
                    type="button"
                    onClick={() => {
                      cambiarUbicacion(loc)
                      setBusqueda('')
                      setMostrarResultados(false)
                    }}
                    className="flex w-full cursor-pointer items-start gap-2 px-3 py-2 text-left text-xs transition hover:bg-brand-50"
                  >
                    <MapPin size={14} className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <span className="font-semibold text-slate-900">{loc.name}</span>
                      <span className="ml-1 text-slate-500">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón GPS */}
          <button
            type="button"
            onClick={obtenerUbicacionGPS}
            disabled={obteniendoGps}
            title="Usar mi ubicación GPS actual"
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700 disabled:opacity-50"
          >
            <Navigation
              size={13}
              className={cn('text-slate-500', obteniendoGps && 'animate-spin text-brand-600')}
            />
            <span className="hidden md:inline">Mi Ubicación</span>
          </button>

          {/* Botón volver a sede oficial */}
          {!esInstitucion && (
            <button
              type="button"
              onClick={restablecerPredeterminada}
              title="Volver a la sede de la Institución"
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
            >
              <Building2 size={13} />
              <span className="hidden md:inline">Sede IE</span>
            </button>
          )}

          {/* Botón refrescar */}
          <button
            type="button"
            onClick={() => refrescar()}
            disabled={actualizando}
            aria-label="Actualizar datos del clima"
            title="Refrescar pronóstico"
            className="cursor-pointer rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-brand-600 disabled:opacity-50"
          >
            <RefreshCw size={14} className={cn(actualizando && 'animate-spin text-brand-600')} />
          </button>
        </div>
      </div>

      {mensajeGps && (
        <div className="bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
          {mensajeGps}
        </div>
      )}

      {/* Contenido principal */}
      {cargando ? (
        <div className="space-y-4 p-6">
          <div className="h-44 w-full animate-pulse rounded-xl bg-slate-100" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      ) : error || !clima ? (
        <div className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-500" />
          <h4 className="mt-2 text-sm font-bold text-slate-800">
            No se pudo cargar la información meteorológica
          </h4>
          <p className="mt-1 text-xs text-slate-500">{error ?? 'Verifique su conexión a internet.'}</p>
          <button
            type="button"
            onClick={() => refrescar()}
            className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-700"
          >
            <RefreshCw size={13} />
            Reintentar
          </button>
        </div>
      ) : (
        <div className="p-5 sm:p-6">
          {/* Tarjeta de Gradiente con Clima Actual */}
          <div
            className={cn(
              'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-md transition-all',
              clima.actual.condicion.fondoGradiente,
              clima.actual.condicion.colorTexto,
            )}
          >
            {/* Adorno visual de fondo */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              {/* Información izquierda: Ciudad, Condición y Temperatura */}
              <div>
                <div className="flex items-center gap-1.5 text-white/90">
                  <MapPin size={16} />
                  <span className="text-sm font-medium tracking-wide">
                    {ubicacionActual.name}
                    {ubicacionActual.admin1 && `, ${ubicacionActual.admin1}`}
                    {ubicacionActual.country && ` (${ubicacionActual.country})`}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                    {clima.actual.temperatura}°
                  </span>
                  <span className="text-2xl font-light text-white/80">C</span>
                  <div className="text-xs text-white/90">
                    <p className="font-semibold">Sensación: {clima.actual.sensacionTermica}°C</p>
                    <p className="opacity-90">
                      Mín {clima.porDias[0]?.tempMin}° / Máx {clima.porDias[0]?.tempMax}°
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-lg font-semibold capitalize text-white drop-shadow-xs">
                  {clima.actual.condicion.descripcion}
                </p>
              </div>

              {/* Icono gigante a la derecha */}
              <div className="flex flex-row items-center justify-between md:flex-col md:items-end">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                  <IconoClima
                    nombre={clima.actual.condicion.icono}
                    className="h-12 w-12 text-white drop-shadow-md"
                  />
                </div>
                <div className="mt-2 text-right text-xs text-white/80">
                  <p>Actualizado: {clima.ultimaActualizacion.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de Recomendación Agropecuaria / Prácticas escolares */}
          {recomendacion && (
            <div
              className={cn(
                'mt-4 flex items-start gap-3 rounded-xl border p-3.5 transition',
                recomendacion.claseContenedor,
              )}
            >
              <recomendacion.icono className={cn('h-5 w-5 shrink-0 mt-0.5', recomendacion.claseIcono)} />
              <div className="text-xs">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-brand-600" />
                  {recomendacion.titulo}
                </p>
                <p className="mt-0.5 opacity-90 leading-relaxed">{recomendacion.mensaje}</p>
              </div>
            </div>
          )}

          {/* Cuadrícula de Métricas Clave */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Humedad */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Droplets size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Humedad</p>
                <p className="text-base font-bold text-slate-800">{clima.actual.humedadRelativa}%</p>
              </div>
            </div>

            {/* Viento */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <Wind size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Viento</p>
                <p className="text-base font-bold text-slate-800">{clima.actual.velocidadViento} km/h</p>
              </div>
            </div>

            {/* Probabilidad de Lluvia */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <CloudRain size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Prob. Lluvia</p>
                <p className="text-base font-bold text-slate-800">
                  {clima.porDias[0]?.probabilidadPrecipitacionMax ?? 0}%
                </p>
              </div>
            </div>

            {/* Radiación UV */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Sun size={20} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Índice UV</p>
                <p className="text-base font-bold text-slate-800">
                  {clima.actual.indiceUv !== undefined ? Math.round(clima.actual.indiceUv) : '—'}
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    {(clima.actual.indiceUv ?? 0) > 7 ? 'Muy alto' : (clima.actual.indiceUv ?? 0) > 5 ? 'Alto' : 'Moderado'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Selector de Pestañas: Por Horas o 7 Días */}
          <div className="mt-6 flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTabActiva('horas')}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  tabActiva === 'horas'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <Clock size={13} />
                Próximas 24 Horas
              </button>
              <button
                type="button"
                onClick={() => setTabActiva('dias')}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  tabActiva === 'dias'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <Calendar size={13} />
                Pronóstico 7 Días
              </button>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Zona horaria local
            </span>
          </div>

          {/* Vista 1: Pronóstico por Horas (Ribbon deslizable) */}
          {tabActiva === 'horas' && (
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-200">
              {clima.porHoras.slice(0, 16).map((hora, idx) => (
                <div
                  key={hora.fechaIso}
                  className={cn(
                    'flex min-w-[72px] shrink-0 flex-col items-center rounded-xl border p-2.5 text-center transition',
                    idx === 0
                      ? 'border-brand-300 bg-brand-50/70 shadow-2xs'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70',
                  )}
                >
                  <span className="text-[11px] font-semibold text-slate-600">{hora.hora}</span>
                  <div className="my-1.5 text-amber-600">
                    <IconoClima nombre={hora.condicion.icono} className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">{hora.temperatura}°</span>
                  {hora.probabilidadPrecipitacion > 0 ? (
                    <span className="mt-1 flex items-center gap-0.5 text-[10px] font-semibold text-blue-600">
                      <Droplets size={10} />
                      {hora.probabilidadPrecipitacion}%
                    </span>
                  ) : (
                    <span className="mt-1 text-[10px] text-slate-400">—</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vista 2: Pronóstico 7 Días */}
          {tabActiva === 'dias' && (
            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/30">
              {clima.porDias.map((dia, idx) => (
                <div
                  key={dia.fechaIso}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 text-xs transition hover:bg-slate-50',
                    idx === 0 && 'bg-brand-50/40 font-semibold',
                  )}
                >
                  <div className="flex w-24 items-center gap-2">
                    <span className="text-slate-800">{dia.fecha}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <IconoClima nombre={dia.condicion.icono} className="h-4 w-4 text-amber-600" />
                    <span className="hidden w-28 truncate text-[11px] sm:inline">
                      {dia.condicion.descripcion}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 w-16 text-blue-600">
                    {dia.probabilidadPrecipitacionMax > 15 ? (
                      <>
                        <CloudRain size={13} />
                        <span className="font-semibold text-[11px]">{dia.probabilidadPrecipitacionMax}%</span>
                      </>
                    ) : (
                      <span className="text-slate-300 text-[11px]">—</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{dia.tempMax}°</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">{dia.tempMin}°</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

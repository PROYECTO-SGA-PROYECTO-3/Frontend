import type { UbicacionClima } from '@/shared/types/weather.types'

export const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Ubicación institucional predeterminada y estática de respaldo.
 * Sede: Institución Educativa Agrícola Fray Isidoro de Montclar (Descanse, Santa Rosa, Cauca).
 */
export const UBICACION_INSTITUCIONAL_RESPALDO: UbicacionClima = {
  nombre: 'IE Agrícola Fray Isidoro de Montclar',
  municipio: 'Descanse',
  departamento: 'Cauca',
  pais: 'Colombia',
  latitud: 1.2064,
  longitud: -76.5417,
  esTiempoReal: false,
}

export const CLAVE_CACHE_UBICACION = 'sga_clima_ubicacion_v1'

import type { ClimaResultado, UbicacionClima } from '@/shared/types/weather.types'
import { OPEN_METEO_FORECAST_URL } from './config'
import { interpretarCodigoWMO } from './wmo-interpreter'

interface OpenMeteoCurrentResponse {
  current?: {
    time: string
    temperature_2m: number
    apparent_temperature?: number
    relative_humidity_2m: number
    is_day: number
    weather_code: number
    wind_speed_10m: number
  }
}

/**
 * Obtiene el clima en tiempo real para las coordenadas dadas (en tiempo real o de respaldo institucional).
 */
export async function obtenerClimaActual(ubicacion: UbicacionClima): Promise<ClimaResultado> {
  const params = new URLSearchParams({
    latitude: ubicacion.latitud.toString(),
    longitude: ubicacion.longitud.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'is_day',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    timezone: 'auto',
  })

  const url = `${OPEN_METEO_FORECAST_URL}?${params.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('No se pudo obtener la información del clima')
  }

  const data = (await res.json()) as OpenMeteoCurrentResponse

  if (!data.current) {
    throw new Error('Respuesta meteorológica incompleta')
  }

  const current = data.current
  const esDia = Boolean(current.is_day)

  return {
    ubicacion,
    actual: {
      temperatura: Math.round(current.temperature_2m),
      sensacionTermica: Math.round(current.apparent_temperature ?? current.temperature_2m),
      humedadRelativa: current.relative_humidity_2m,
      vientoVelocidad: Math.round(current.wind_speed_10m),
      codigoClima: current.weather_code,
      esDia,
      condicion: interpretarCodigoWMO(current.weather_code, esDia),
      ultimaActualizacion: new Date(),
    },
  }
}

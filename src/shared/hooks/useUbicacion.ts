import { useState, useEffect, useCallback } from 'react'
import type { UbicacionClima } from '@/shared/types/weather.types'
import { UBICACION_INSTITUCIONAL_RESPALDO, CLAVE_CACHE_UBICACION } from '@/shared/lib/weather'

/**
 * Lee la ubicación previamente guardada en el almacenamiento local.
 * Si los datos están corruptos, limpia la clave y recurre a la sede institucional.
 */
function cargarUbicacionInicial(): UbicacionClima {
  try {
    const cached = localStorage.getItem(CLAVE_CACHE_UBICACION)
    if (cached) {
      return JSON.parse(cached) as UbicacionClima
    }
  } catch (error) {
    console.warn(
      '[useUbicacion] Error al leer la ubicación en caché de localStorage. Saneando registro:',
      error,
    )
    try {
      localStorage.removeItem(CLAVE_CACHE_UBICACION)
    } catch (removeError) {
      console.warn('[useUbicacion] No se pudo limpiar localStorage:', removeError)
    }
  }
  return UBICACION_INSTITUCIONAL_RESPALDO
}

/**
 * Hook exclusivo para gestión de ubicación geográfica (GPS / Geolocalización del navegador y Respaldo Institucional).
 * Sigue la regla #3 de AGENTS.md (Responsabilidad Única).
 */
export function useUbicacion() {
  const [ubicacion, setUbicacion] = useState<UbicacionClima>(cargarUbicacionInicial)
  const [detectandoUbicacion, setDetectandoUbicacion] = useState(false)
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null)

  // Solicitar ubicación GPS en tiempo real
  const solicitarUbicacionEnTiempoReal = useCallback(() => {
    if (!('geolocation' in navigator)) {
      const msg = 'La API de geolocalización no es compatible con este navegador'
      console.warn(`[useUbicacion] ${msg}`)
      setErrorUbicacion(msg)
      return
    }

    setDetectandoUbicacion(true)
    setErrorUbicacion(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4))
        const lon = Number(pos.coords.longitude.toFixed(4))

        let municipio = 'Mi Ubicación'
        let departamento: string | undefined

        // Geocodificación inversa para identificar municipio y departamento
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`,
            { headers: { 'User-Agent': 'SGA-Academico-App' } },
          )
          if (res.ok) {
            const data = await res.json()
            municipio =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.municipality ||
              data.address?.county ||
              'Mi Ubicación'
            departamento = data.address?.state
          } else {
            console.warn(
              `[useUbicacion] Geocodificación inversa respondió con estado HTTP ${res.status}. Usando nombre genérico.`,
            )
          }
        } catch (error) {
          console.warn(
            '[useUbicacion] Error al resolver el nombre del municipio mediante coordenadas:',
            error,
          )
        }

        const ubicacionDetectada: UbicacionClima = {
          nombre: municipio,
          municipio,
          departamento,
          latitud: lat,
          longitud: lon,
          esTiempoReal: true,
        }

        try {
          localStorage.setItem(CLAVE_CACHE_UBICACION, JSON.stringify(ubicacionDetectada))
        } catch (error) {
          console.warn('[useUbicacion] No se pudo persistir la ubicación en localStorage:', error)
        }

        setUbicacion(ubicacionDetectada)
        setDetectandoUbicacion(false)
      },
      (geoError: GeolocationPositionError) => {
        setDetectandoUbicacion(false)

        let motivo = 'Error desconocido al obtener la posición GPS'
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            motivo = 'Permiso de geolocalización denegado por el usuario'
            console.debug(`[useUbicacion] ${motivo}. Manteniendo sede institucional de respaldo.`)
            break
          case geoError.POSITION_UNAVAILABLE:
            motivo = 'La información de ubicación no está disponible en este dispositivo'
            console.warn(`[useUbicacion] ${motivo}.`)
            break
          case geoError.TIMEOUT:
            motivo = 'Se agotó el tiempo de espera para obtener la ubicación GPS'
            console.warn(`[useUbicacion] ${motivo}.`)
            break
          default:
            console.warn(`[useUbicacion] ${motivo}:`, geoError.message)
        }

        setErrorUbicacion(motivo)
      },
      { timeout: 8000, maximumAge: 1000 * 60 * 60 },
    )
  }, [])

  // Detección inicial silenciosa si el navegador lo permite
  useEffect(() => {
    if (!ubicacion.esTiempoReal && 'geolocation' in navigator) {
      solicitarUbicacionEnTiempoReal()
    }
  }, [ubicacion.esTiempoReal, solicitarUbicacionEnTiempoReal])

  // Restablecer a la sede institucional de respaldo
  const usarUbicacionInstitucional = useCallback(() => {
    try {
      localStorage.removeItem(CLAVE_CACHE_UBICACION)
    } catch (error) {
      console.warn('[useUbicacion] No se pudo limpiar la clave de ubicación en localStorage:', error)
    }
    setUbicacion(UBICACION_INSTITUCIONAL_RESPALDO)
    setErrorUbicacion(null)
  }, [])

  return {
    ubicacion,
    detectandoUbicacion,
    errorUbicacion,
    esTiempoReal: Boolean(ubicacion.esTiempoReal),
    solicitarUbicacionEnTiempoReal,
    usarUbicacionInstitucional,
  }
}

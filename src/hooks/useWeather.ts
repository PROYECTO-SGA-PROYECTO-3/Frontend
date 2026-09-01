import { useState, useCallback, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UbicacionGeo } from '@/types/weather.types'
import {
  UBICACION_PREDETERMINADA,
  obtenerPronostico,
  buscarUbicaciones,
  geocodificarInverso,
} from '@/api/weather.api'

const CLAVE_STORAGE_UBICACION = 'sga_clima_ubicacion_v3'

function cargarUbicacionGuardada(): UbicacionGeo {
  try {
    const item = localStorage.getItem(CLAVE_STORAGE_UBICACION)
    if (item) {
      return JSON.parse(item) as UbicacionGeo
    }
  } catch {
    // Ignorar error de parsing y usar predeterminada
  }
  return UBICACION_PREDETERMINADA
}

export function useWeather() {
  const [ubicacionActual, setUbicacionActual] = useState<UbicacionGeo>(cargarUbicacionGuardada)
  const [mensajeGps, setMensajeGps] = useState<string | null>(null)
  const [obteniendoGps, setObteniendoGps] = useState(false)

  // Guardar ubicación en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE_UBICACION, JSON.stringify(ubicacionActual))
    } catch {
      // Ignorar error de storage
    }
  }, [ubicacionActual])

  // Detección automática de ubicación en tiempo real al montar
  useEffect(() => {
    if (!navigator.geolocation) return

    // Intentar obtener la ubicación real automáticamente
    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const { latitude, longitude } = posicion.coords
        const latNum = Number(latitude.toFixed(4))
        const lonNum = Number(longitude.toFixed(4))

        // Geocodificación inversa para obtener el municipio real
        const datosLugar = await geocodificarInverso(latNum, lonNum)
        const nuevaUbicacion: UbicacionGeo = {
          id: Date.now(),
          name: datosLugar.name || 'Mi Ubicación',
          latitude: latNum,
          longitude: lonNum,
          admin1: datosLugar.admin1,
          country: datosLugar.country || 'Colombia',
          country_code: datosLugar.country_code || 'CO',
        }

        setUbicacionActual(nuevaUbicacion)
      },
      () => {
        // Si el usuario no otorga permisos, se mantiene la sede predeterminada sin errores
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 1000 * 60 * 30 },
    )
  }, [])

  // Consulta de datos de clima con React Query (caché de 10 minutos)
  const {
    data: clima,
    isLoading: cargando,
    isFetching: actualizando,
    error: errorQuery,
    refetch: refrescar,
  } = useQuery({
    queryKey: ['clima', ubicacionActual.latitude, ubicacionActual.longitude, ubicacionActual.name],
    queryFn: () =>
      obtenerPronostico(
        ubicacionActual.latitude,
        ubicacionActual.longitude,
        ubicacionActual.name ? ubicacionActual : undefined,
      ),
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchInterval: 1000 * 60 * 15, // Actualizar cada 15 min en segundo plano
    refetchOnWindowFocus: false,
  })

  // Cambiar de ubicación
  const cambiarUbicacion = useCallback((nuevaUbicacion: UbicacionGeo) => {
    setUbicacionActual(nuevaUbicacion)
    setMensajeGps(null)
  }, [])

  // Restablecer a la ubicación de la institución
  const restablecerPredeterminada = useCallback(() => {
    cambiarUbicacion(UBICACION_PREDETERMINADA)
  }, [cambiarUbicacion])

  // Obtener geolocalización GPS manual
  const obtenerUbicacionGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setMensajeGps('La geolocalización no es compatible con este navegador.')
      return
    }

    setObteniendoGps(true)
    setMensajeGps(null)

    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const { latitude, longitude } = posicion.coords
        const latNum = Number(latitude.toFixed(4))
        const lonNum = Number(longitude.toFixed(4))
        try {
          const datosLugar = await geocodificarInverso(latNum, lonNum)
          const nuevaUbicacion: UbicacionGeo = {
            id: Date.now(),
            name: datosLugar.name || 'Mi Ubicación Actual (GPS)',
            latitude: latNum,
            longitude: lonNum,
            admin1: datosLugar.admin1,
            country: datosLugar.country || 'Colombia',
            country_code: datosLugar.country_code || 'CO',
          }
          cambiarUbicacion(nuevaUbicacion)
          setMensajeGps('Ubicación detectada correctamente.')
        } catch {
          setMensajeGps('No se pudo identificar el nombre de la ubicación.')
        } finally {
          setObteniendoGps(false)
        }
      },
      (error) => {
        setObteniendoGps(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setMensajeGps('Permiso de ubicación denegado en el navegador.')
            break
          default:
            setMensajeGps('Error al obtener ubicación GPS.')
        }
      },
      { timeout: 10000, enableHighAccuracy: true },
    )
  }, [cambiarUbicacion])

  return {
    clima,
    ubicacionActual,
    cargando,
    actualizando,
    error: errorQuery ? (errorQuery as Error).message : null,
    mensajeGps,
    obteniendoGps,
    refrescar,
    cambiarUbicacion,
    buscarUbicaciones,
    restablecerPredeterminada,
    obtenerUbicacionGPS,
    esInstitucion: ubicacionActual.id === UBICACION_PREDETERMINADA.id,
  }
}

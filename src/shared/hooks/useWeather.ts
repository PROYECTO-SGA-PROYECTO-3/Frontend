import { useQuery } from '@tanstack/react-query'
import { obtenerClimaActual } from '@/shared/lib/weather'
import { useUbicacion } from './useUbicacion'

/**
 * Hook exclusivo para la consulta y sincronización de datos meteorológicos. */
export function useWeather() {
  const {
    ubicacion,
    detectandoUbicacion,
    errorUbicacion,
    esTiempoReal,
    solicitarUbicacionEnTiempoReal,
    usarUbicacionInstitucional,
  } = useUbicacion()

  // Consulta de servidor indexada por las coordenadas de la ubicación
  const {
    data: clima,
    isLoading: cargando,
    isFetching: actualizandoClima,
    error: errorQuery,
    refetch: refrescar,
  } = useQuery({
    queryKey: ['clima', ubicacion.latitud, ubicacion.longitud],
    queryFn: () => obtenerClimaActual(ubicacion),
    staleTime: 1000 * 60 * 15, // 15 minutos de caché fresca
    refetchInterval: 1000 * 60 * 30, // 30 minutos de auto-refresco
    refetchOnWindowFocus: false,
  })

  return {
    clima,
    ubicacion,
    cargando,
    actualizando: actualizandoClima || detectandoUbicacion,
    error: errorQuery ? (errorQuery as Error).message : null,
    errorUbicacion,
    esTiempoReal,
    refrescar,
    solicitarUbicacionEnTiempoReal,
    usarUbicacionInstitucional,
  }
}

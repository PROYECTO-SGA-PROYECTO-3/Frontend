import { useQuery } from '@tanstack/react-query'
import { obtenerEstudiante } from '../api/estudiantesApi'
import { extraerMensajeError } from '@/shared/lib'
import { ESTUDIANTES_QUERY_KEYS } from './queryKeys'
import type { Estudiante } from '../types'

/**
 * Hook responsable de consultar la información de un estudiante por su ID
 * para edición o visualización de perfil.
 */
export function useEstudianteDetalle(id: number | null | undefined) {
  const activo = Boolean(id && !Number.isNaN(id))

  const {
    data: estudiante,
    isLoading,
    isError,
    error,
    refetch, 
  } = useQuery<Estudiante, Error>({
    queryKey: ESTUDIANTES_QUERY_KEYS.detalle(id),
    queryFn: () => obtenerEstudiante(id!),
    enabled: activo,
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
  })

  return {
    estudiante,
    isLoading: activo ? isLoading : false,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
  }
}

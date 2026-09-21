import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import { obtenerDocente } from '../api/docentesApi'
import type { Docente } from '../types'

export const DOCENTE_DETALLE_QUERY_KEY = 'docente-detalle'

/**
 * Hook responsable exclusivamente de consultar la información detallada
 * de un docente por su ID.
 */
export function useDocenteDetalle(id: number | null | undefined) {
  const activo = typeof id === 'number' && !Number.isNaN(id) && id > 0

  const {
    data: docente,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Docente, Error>({
    queryKey: [DOCENTE_DETALLE_QUERY_KEY, id],
    queryFn: () => obtenerDocente(id as number),
    enabled: activo,
    staleTime: 1000 * 60 * 3, // 3 minutos
  })

  return {
    docente: docente ?? null,
    isLoading: activo ? isLoading : false,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
  }
}

import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import { listarAsignaturas } from '../api/materiasApi'
import type { Asignatura } from '../types'

export const ASIGNATURAS_QUERY_KEY = ['asignaturas'] as const

/**
 * Hook responsable exclusivamente de la obtención y estado de sincronización
 * del catálogo de asignaturas desde el servidor mediante React Query.
 */
export function useCatalogoMaterias() {
  const {
    data: asignaturas = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Asignatura[], Error>({
    queryKey: ASIGNATURAS_QUERY_KEY,
    queryFn: listarAsignaturas,
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
  })

  return {
    asignaturas,
    isLoading,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
    isFetching,
  }
}

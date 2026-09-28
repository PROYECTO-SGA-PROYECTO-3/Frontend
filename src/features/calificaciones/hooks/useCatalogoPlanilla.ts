import { useQuery } from '@tanstack/react-query'
import { listarMisCargas, listarPeriodosActivos } from '../api/notasApi'
import type { CargaAcademica, Periodo } from '@/shared/types/academico.types'

export const CARGAS_DOCENTE_KEY = ['cargas-docente'] as const
export const PERIODOS_ACTIVOS_KEY = ['periodos-activos'] as const

export function useCatalogoPlanilla() {
  const queryCargas = useQuery<CargaAcademica[], Error>({
    queryKey: CARGAS_DOCENTE_KEY,
    queryFn: listarMisCargas,
    staleTime: 1000 * 60 * 5,
  })

  const queryPeriodos = useQuery<Periodo[], Error>({
    queryKey: PERIODOS_ACTIVOS_KEY,
    queryFn: listarPeriodosActivos,
    staleTime: 1000 * 60 * 5,
  })

  const isLoading = queryCargas.isLoading || queryPeriodos.isLoading
  const isError = queryCargas.isError || queryPeriodos.isError
  const error = queryCargas.error || queryPeriodos.error

  const refetch = async () => {
    await Promise.all([queryCargas.refetch(), queryPeriodos.refetch()])
  }

  return {
    cargas: queryCargas.data ?? [],
    periodos: queryPeriodos.data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  }
}

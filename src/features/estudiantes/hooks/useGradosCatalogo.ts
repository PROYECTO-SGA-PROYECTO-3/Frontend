import { useQuery } from '@tanstack/react-query'
import { listarGrados } from '../api/estudiantesApi'
import type { Grado } from '@/shared/types/academico.types'

export const GRADOS_QUERY_KEY = ['grados-catalogo'] as const

/**
 * Hook responsable exclusivamente de consultar y cachear el catálogo de grados académicos.
 */
export function useGradosCatalogo() {
  const {
    data: grados = [],
    isLoading,
    isError,
    error,
  } = useQuery<Grado[], Error>({
    queryKey: GRADOS_QUERY_KEY,
    queryFn: listarGrados,
    staleTime: 1000 * 60 * 15, // 15 minutos (catálogo infrecuente)
  })

  return {
    grados,
    isLoading,
    isError,
    error,
  }
}

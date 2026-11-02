import { useQuery } from '@tanstack/react-query'
import { listarGrados } from '../api/estudiantesApi'
import { ESTUDIANTES_QUERY_KEYS } from './queryKeys'
import type { Grado } from '@/shared/types/academico.types'

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
    queryKey: ESTUDIANTES_QUERY_KEYS.grados,
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

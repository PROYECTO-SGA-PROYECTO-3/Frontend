import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { Grado } from '@/shared/types/academico.types'
import { listarGrados } from '../api/cursosApi'
import { CURSOS_QUERY_KEYS } from './queryKeys'

export function useCursos() {
  const {
    data: cursos = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Grado[], Error>({
    queryKey: CURSOS_QUERY_KEYS.listas(),
    queryFn: listarGrados,
    staleTime: 1000 * 60 * 5,
  })

  return {
    cursos,
    isLoading,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
    isFetching,
  }
}

import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { Grado } from '@/shared/types/academico.types'
import { obtenerGrado } from '../api/cursosApi'
import { CURSOS_QUERY_KEYS } from './queryKeys'

/**
 * Hook responsable de consultar la información puntual de un curso por su ID.
 * Se habilita únicamente con identificadores válidos.
 */
export function useCursoDetalle(id: number) {
  const idValido = Number.isInteger(id) && id > 0

  const {
    data: curso = null,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Grado, Error>({
    queryKey: CURSOS_QUERY_KEYS.detalle(id),
    queryFn: () => obtenerGrado(id),
    enabled: idValido,
    staleTime: 1000 * 60 * 5,
  })

  return {
    curso,
    isLoading,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
    isFetching,
  }
}

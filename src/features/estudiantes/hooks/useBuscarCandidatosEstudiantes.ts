import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { Estudiante } from '../types'
import { buscarCandidatosEstudiantes } from '../api/estudiantesApi'

export interface UseBuscarCandidatosEstudiantesOpciones {
  limite?: number
  enabled?: boolean
}

/**
 * Hook de servicio para autocompletados y selectores de estudiantes.
 * Consulta al backend Spring Boot sin gestionar paginación en el cliente.
 */
export function useBuscarCandidatosEstudiantes(
  termino: string,
  { limite = 5, enabled = true }: UseBuscarCandidatosEstudiantesOpciones = {},
) {
  const terminoLimpio = termino.trim()
  const puedeBuscar = enabled && terminoLimpio.length >= 2

  const {
    data: candidatos = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<Estudiante[], Error>({
    queryKey: ['estudiantes', 'candidatos', terminoLimpio, limite],
    queryFn: () => buscarCandidatosEstudiantes(terminoLimpio, limite),
    enabled: puedeBuscar,
    staleTime: 1000 * 60 * 2, // 2 minutos de frescura
  })

  return {
    candidatos,
    estaBuscando: isLoading || isFetching,
    isError,
    error: error ? extraerMensajeError(error) : null,
    refetch,
  }
}

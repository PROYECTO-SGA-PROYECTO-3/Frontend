import { useQuery } from '@tanstack/react-query'
import { listarAniosLectivos } from '../api/aniosLectivosApi'
import { extraerMensajeError } from '@/shared/lib'

export function useAniosLectivosQuery() {
  const {
    data: anios = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['aniosLectivos'],
    queryFn: listarAniosLectivos,
  })

  const anioActivoActual = anios.find((a) => a.activo) ?? null

  return {
    anios,
    anioActivoActual,
    isLoading,
    errorCarga: error ? extraerMensajeError(error) : null,
    refetch,
  }
}

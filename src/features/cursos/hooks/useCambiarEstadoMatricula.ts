import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CURSOS_QUERY_KEYS } from './queryKeys'
import { cambiarEstadoMatricula } from '../api/cursosApi'
import { extraerMensajeError } from '@/shared/lib'
import type { SolicitudCambiarEstado, Matricula } from '@/shared/types/matricula.types'

export interface CambiarEstadoParams {
  matriculaId: number
  datos: SolicitudCambiarEstado
}

export function useCambiarEstadoMatricula(cursoId: number) {
  const queryClient = useQueryClient()

  const {
    mutateAsync: cambiarEstado,
    isPending: estaCambiandoEstado,
    isError,
    error,
    reset: resetearError,
  } = useMutation<Matricula, Error, CambiarEstadoParams>({
    mutationFn: ({ matriculaId, datos }: CambiarEstadoParams) =>
      cambiarEstadoMatricula(matriculaId, datos),
    onSuccess: () => {
      // Invalida la lista de estudiantes para actualizar la tabla del curso en tiempo real
      queryClient.invalidateQueries({
        queryKey: CURSOS_QUERY_KEYS.estudiantes(cursoId),
      })
    },
  })

  const errorCambioEstado = isError
    ? extraerMensajeError(error) || 'No fue posible cambiar el estado de la matrícula.'
    : null

  return {
    cambiarEstado,
    estaCambiandoEstado,
    errorCambioEstado,
    resetearError,
  }
}

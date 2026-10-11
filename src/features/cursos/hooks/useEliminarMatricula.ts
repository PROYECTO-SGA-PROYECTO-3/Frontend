import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CURSOS_QUERY_KEYS } from './queryKeys'
import { eliminarMatricula } from '../api/cursosApi'
import { extraerMensajeError } from '@/shared/lib/axios'

export function useEliminarMatricula(cursoId: number) {
  const queryClient = useQueryClient()

  const {
    mutateAsync: retirarEstudiante,
    isPending: estaRetirando,
    isError,
    error,
    reset: resetearError,
  } = useMutation({
    mutationFn: (matriculaId: number) => eliminarMatricula(matriculaId),
    onSuccess: () => {
      // Invalida la lista de estudiantes para actualizar la tabla del curso en tiempo real
      queryClient.invalidateQueries({
        queryKey: CURSOS_QUERY_KEYS.estudiantes(cursoId),
      })
    },
  })

  const errorRetiro = isError
    ? extraerMensajeError(error) || 'No fue posible retirar al estudiante del curso.'
    : null

  return {
    retirarEstudiante,
    estaRetirando,
    errorRetiro,
    resetearError,
  }
}

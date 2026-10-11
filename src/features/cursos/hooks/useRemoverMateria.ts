import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import { eliminarCargaAcademica } from '../api/cursosApi'
import { CURSOS_QUERY_KEYS } from './queryKeys'

/**
 * Hook responsable de remover una materia de la carga académica del curso.
 * Aclara la intención en interfaz de que no se elimina la materia del catálogo
 * institucional general, sino únicamente su asignación en este curso.
 */
export function useRemoverMateria(cursoId: number) {
  const queryClient = useQueryClient()

  const mutacion = useMutation({
    mutationFn: (cargaId: number) => eliminarCargaAcademica(cargaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURSOS_QUERY_KEYS.cargas(cursoId),
      })
    },
  })

  return {
    removerMateria: mutacion.mutateAsync,
    estaRemoviendo: mutacion.isPending,
    errorRemover: mutacion.error
      ? extraerMensajeError(mutacion.error)
      : null,
    resetearError: mutacion.reset,
  }
}

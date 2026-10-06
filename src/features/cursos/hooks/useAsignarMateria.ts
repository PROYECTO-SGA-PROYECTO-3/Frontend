import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { SolicitudCrearCarga } from '@/shared/types/academico.types'
import { crearCargaAcademica } from '../api/cursosApi'
import { CURSOS_QUERY_KEYS } from './queryKeys'

/**
 * Hook responsable de asociar una nueva asignatura con su docente titular al curso.
 */
export function useAsignarMateria(cursoId: number) {
  const queryClient = useQueryClient()

  const mutacion = useMutation({
    mutationFn: (datos: Omit<SolicitudCrearCarga, 'gradoId'>) =>
      crearCargaAcademica({ ...datos, gradoId: cursoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CURSOS_QUERY_KEYS.cargas(cursoId),
      })
    },
  })

  return {
    asignarMateria: mutacion.mutateAsync,
    estaAsignando: mutacion.isPending,
    errorAsignar: mutacion.error ? extraerMensajeError(mutacion.error) : null,
    resetearError: mutacion.reset,
  }
}

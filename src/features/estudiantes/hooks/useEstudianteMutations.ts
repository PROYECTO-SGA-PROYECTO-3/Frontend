import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  activarEstudiante,
  desactivarEstudiante,
  eliminarEstudiante,
} from '../api/estudiantesApi'
import { ESTUDIANTES_QUERY_KEY } from './useCatalogoEstudiantes'

/**
 * Hook responsable exclusivamente de las mutaciones sobre estudiantes
 * (activación, desactivación y eliminación) e invalidación de caché.
 */
export function useEstudianteMutations() {
  const queryClient = useQueryClient()

  const invalidarEstudiantes = () => {
    queryClient.invalidateQueries({ queryKey: ESTUDIANTES_QUERY_KEY })
  }

  const { mutateAsync: mutarActivar, isPending: estaActivando } = useMutation({
    mutationFn: (id: number) => activarEstudiante(id),
    onSuccess: invalidarEstudiantes,
  })

  const { mutateAsync: mutarDesactivar, isPending: estaDesactivando } = useMutation({
    mutationFn: (id: number) => desactivarEstudiante(id),
    onSuccess: invalidarEstudiantes,
  })

  const { mutateAsync: mutarEliminar, isPending: estaEliminando } = useMutation({
    mutationFn: (id: number) => eliminarEstudiante(id),
    onSuccess: invalidarEstudiantes,
  })

  return {
    activarEstudiante: mutarActivar,
    estaActivando,
    desactivarEstudiante: mutarDesactivar,
    estaDesactivando,
    eliminarEstudiante: mutarEliminar,
    estaEliminando,
  }
}

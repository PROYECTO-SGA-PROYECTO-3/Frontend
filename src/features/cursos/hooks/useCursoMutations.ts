import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { SolicitudGrado } from '@/shared/types/academico.types'
import { actualizarGrado, crearGrado, eliminarGrado } from '../api/cursosApi'
import { CURSOS_QUERY_KEYS } from './queryKeys'

export function useCursoMutations() {
  const queryClient = useQueryClient()

  // Crear grado
  const mutacionCrear = useMutation({
    mutationFn: (datos: SolicitudGrado) => crearGrado(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURSOS_QUERY_KEYS.todos })
    },
  })

  // Actualizar grado
  const mutacionActualizar = useMutation({
    mutationFn: ({
      id,
      datos,
    }: {
      id: number
      datos: SolicitudGrado
    }) => actualizarGrado(id, datos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CURSOS_QUERY_KEYS.todos })
      queryClient.invalidateQueries({ queryKey: CURSOS_QUERY_KEYS.detalle(id) })
    },
  })

  // Eliminar grado
  const mutacionEliminar = useMutation({
    mutationFn: (id: number) => eliminarGrado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURSOS_QUERY_KEYS.todos })
    },
  })

  return {
    // Crear
    crearCurso: mutacionCrear.mutateAsync,
    estaCreando: mutacionCrear.isPending,
    errorCrear: mutacionCrear.error ? extraerMensajeError(mutacionCrear.error) : null,

    // Actualizar
    actualizarCurso: mutacionActualizar.mutateAsync,
    estaActualizando: mutacionActualizar.isPending,
    errorActualizar: mutacionActualizar.error
      ? extraerMensajeError(mutacionActualizar.error)
      : null,

    // Eliminar
    eliminarCurso: mutacionEliminar.mutateAsync,
    estaEliminando: mutacionEliminar.isPending,
    errorEliminar: mutacionEliminar.error
      ? extraerMensajeError(mutacionEliminar.error)
      : null,
  }
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import {
  actualizarAsignatura,
  crearAsignatura,
  eliminarAsignatura,
} from '../api/materiasApi'
import { ASIGNATURAS_QUERY_KEY } from './useCatalogoMaterias'
import type { SolicitudCrearAsignatura } from '../types'

/**
 * Hook responsable exclusivamente de ejecutar las operaciones de mutación
 * (crear, actualizar, eliminar) sobre el catálogo de materias.
 */
export function useMateriaMutations() {
  const queryClient = useQueryClient()

  // Mutación: Registrar nueva asignatura
  const mutacionCrear = useMutation({
    mutationFn: (datos: SolicitudCrearAsignatura) => crearAsignatura(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASIGNATURAS_QUERY_KEY })
    },
  })

  // Mutación: Actualizar asignatura existente
  const mutacionActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: SolicitudCrearAsignatura }) =>
      actualizarAsignatura(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASIGNATURAS_QUERY_KEY })
    },
  })

  // Mutación: Eliminar asignatura
  const mutacionEliminar = useMutation({
    mutationFn: (id: number) => eliminarAsignatura(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASIGNATURAS_QUERY_KEY })
    },
  })

  return {
    // Crear
    crearMateria: mutacionCrear.mutateAsync,
    estaCreando: mutacionCrear.isPending,
    errorCrear: mutacionCrear.error ? extraerMensajeError(mutacionCrear.error) : null,

    // Actualizar
    actualizarMateria: mutacionActualizar.mutateAsync,
    estaActualizando: mutacionActualizar.isPending,
    errorActualizar: mutacionActualizar.error
      ? extraerMensajeError(mutacionActualizar.error)
      : null,

    // Eliminar
    eliminarMateria: mutacionEliminar.mutateAsync,
    estaEliminando: mutacionEliminar.isPending,
    errorEliminar: mutacionEliminar.error
      ? extraerMensajeError(mutacionEliminar.error)
      : null,
  }
}

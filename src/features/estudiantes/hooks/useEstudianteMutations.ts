import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  activarEstudiante,
  actualizarEstudiante,
  crearEstudiante,
  desactivarEstudiante,
  eliminarEstudiante,
} from '../api/estudiantesApi'
import { ESTUDIANTES_QUERY_KEY } from './useCatalogoEstudiantes'
import { ESTUDIANTE_DETALLE_QUERY_KEY } from './useEstudianteDetalle'
import type { SolicitudActualizarEstudiante, SolicitudCrearEstudiante } from '../types'

/**
 * Hook responsable de ejecutar y sincronizar mutaciones del dominio de estudiantes
 * (crear, actualizar, activar, desactivar y eliminar) con invalidación de caché reactiva.
 */
export function useEstudianteMutations() {
  const queryClient = useQueryClient()

  const invalidarConsultas = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: ESTUDIANTES_QUERY_KEY })
    if (id) {
      queryClient.invalidateQueries({ queryKey: [ESTUDIANTE_DETALLE_QUERY_KEY, id] })
    }
  }

  // Mutación: Crear estudiante
  const { mutateAsync: mutarCrear, isPending: estaCreando } = useMutation({
    mutationFn: (datos: SolicitudCrearEstudiante) => crearEstudiante(datos),
    onSuccess: () => invalidarConsultas(),
  })

  // Mutación: Actualizar datos personales
  const { mutateAsync: mutarActualizar, isPending: estaActualizando } = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: SolicitudActualizarEstudiante }) =>
      actualizarEstudiante(id, datos),
    onSuccess: (_, variables) => invalidarConsultas(variables.id),
  })

  // Mutación: Activar cuenta
  const { mutateAsync: mutarActivar, isPending: estaActivando } = useMutation({
    mutationFn: (id: number) => activarEstudiante(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Desactivar cuenta
  const { mutateAsync: mutarDesactivar, isPending: estaDesactivando } = useMutation({
    mutationFn: (id: number) => desactivarEstudiante(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Eliminar definitivamente
  const { mutateAsync: mutarEliminar, isPending: estaEliminando } = useMutation({
    mutationFn: (id: number) => eliminarEstudiante(id),
    onSuccess: () => invalidarConsultas(),
  })

  return {
    crearEstudiante: mutarCrear,
    estaCreando,
    actualizarEstudiante: mutarActualizar,
    estaActualizando,
    activarEstudiante: mutarActivar,
    estaActivando,
    desactivarEstudiante: mutarDesactivar,
    estaDesactivando,
    eliminarEstudiante: mutarEliminar,
    estaEliminando,
  }
}

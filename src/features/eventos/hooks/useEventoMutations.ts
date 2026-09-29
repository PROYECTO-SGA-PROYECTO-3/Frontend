import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import { crearEvento, eliminarEvento } from '../api/eventosApi'
import { EVENTOS_INSTITUCIONALES_KEY } from './useEventosInstitucionales'
import type { SolicitudCrearEvento } from '../types'

/**
 * Hook responsable de las mutaciones (crear, eliminar)
 * de eventos institucionales con TanStack React Query.
 */
export function useEventoMutations() {
  const queryClient = useQueryClient()

  // Mutación: Registrar nuevo evento institucional
  const mutacionCrear = useMutation({
    mutationFn: (datos: SolicitudCrearEvento) => crearEvento(datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_INSTITUCIONALES_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboardAdmin'] })
    },
  })

  // Mutación: Eliminar evento institucional existente
  const mutacionEliminar = useMutation({
    mutationFn: (id: number) => eliminarEvento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_INSTITUCIONALES_KEY })
      queryClient.invalidateQueries({ queryKey: ['dashboardAdmin'] })
    },
  })

  return {
    // Crear
    crearEvento: mutacionCrear.mutateAsync,
    estaCreando: mutacionCrear.isPending,
    errorCrear: mutacionCrear.error ? extraerMensajeError(mutacionCrear.error) : null,

    // Eliminar
    eliminarEvento: mutacionEliminar.mutateAsync,
    estaEliminando: mutacionEliminar.isPending,
    errorEliminar: mutacionEliminar.error ? extraerMensajeError(mutacionEliminar.error) : null,
  }
}

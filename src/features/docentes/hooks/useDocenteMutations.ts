import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib/axios'
import {
  activarDocente,
  actualizarDocente,
  actualizarFirmaDocente,
  crearDocente,
  desactivarDocente,
  eliminarDocente,
} from '../api/docentesApi'
import { DOCENTES_QUERY_KEY } from './useCatalogoDocentes'
import { DOCENTE_DETALLE_QUERY_KEY } from './useDocenteDetalle'
import type { SolicitudActualizarDocente, SolicitudCrearDocente } from '../types'

/**
 * Hook responsable exclusivamente de ejecutar y sincronizar mutaciones
 * del dominio de docentes (crear, editar, activar, desactivar, firma, eliminar).
 */
export function useDocenteMutations() {
  const queryClient = useQueryClient()

  const invalidarConsultas = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEY })
    if (id) {
      queryClient.invalidateQueries({ queryKey: [DOCENTE_DETALLE_QUERY_KEY, id] })
    }
  }

  // Mutación: Crear docente
  const mutacionCrear = useMutation({
    mutationFn: (datos: SolicitudCrearDocente) => crearDocente(datos),
    onSuccess: () => invalidarConsultas(),
  })

  // Mutación: Actualizar datos personales
  const mutacionActualizar = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: SolicitudActualizarDocente }) =>
      actualizarDocente(id, datos),
    onSuccess: (_, variables) => invalidarConsultas(variables.id),
  })

  // Mutación: Cargar / actualizar firma digital
  const mutacionFirma = useMutation({
    mutationFn: ({ id, archivo }: { id: number; archivo: File }) =>
      actualizarFirmaDocente(id, archivo),
    onSuccess: (_, variables) => invalidarConsultas(variables.id),
  })

  // Mutación: Activar docente
  const mutacionActivar = useMutation({
    mutationFn: (id: number) => activarDocente(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Desactivar docente
  const mutacionDesactivar = useMutation({
    mutationFn: (id: number) => desactivarDocente(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Eliminar docente
  const mutacionEliminar = useMutation({
    mutationFn: (id: number) => eliminarDocente(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  return {
    // Crear
    crearDocente: mutacionCrear.mutateAsync,
    estaCreando: mutacionCrear.isPending,
    errorCrear: mutacionCrear.error ? extraerMensajeError(mutacionCrear.error) : null,

    // Actualizar
    actualizarDocente: mutacionActualizar.mutateAsync,
    estaActualizando: mutacionActualizar.isPending,
    errorActualizar: mutacionActualizar.error
      ? extraerMensajeError(mutacionActualizar.error)
      : null,

    // Firma
    actualizarFirma: mutacionFirma.mutateAsync,
    estaSubiendoFirma: mutacionFirma.isPending,
    errorFirma: mutacionFirma.error ? extraerMensajeError(mutacionFirma.error) : null,

    // Activar
    activarDocente: mutacionActivar.mutateAsync,
    estaActivando: mutacionActivar.isPending,
    errorActivar: mutacionActivar.error ? extraerMensajeError(mutacionActivar.error) : null,

    // Desactivar
    desactivarDocente: mutacionDesactivar.mutateAsync,
    estaDesactivando: mutacionDesactivar.isPending,
    errorDesactivar: mutacionDesactivar.error
      ? extraerMensajeError(mutacionDesactivar.error)
      : null,

    // Eliminar
    eliminarDocente: mutacionEliminar.mutateAsync,
    estaEliminando: mutacionEliminar.isPending,
    errorEliminar: mutacionEliminar.error ? extraerMensajeError(mutacionEliminar.error) : null,
  }
}

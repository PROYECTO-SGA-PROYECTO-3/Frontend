import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib'
import {
  activarDocente,
  actualizarDocente,
  actualizarFirmaDocente,
  crearDocente,
  desactivarDocente,
  eliminarDocente,
} from '../api/docentesApi'
import { DOCENTES_QUERY_KEYS } from './queryKeys'
import type { SolicitudActualizarDocente, SolicitudCrearDocente } from '../types'

/**
 * Hook responsable exclusivamente de ejecutar y sincronizar mutaciones
 * del dominio de docentes (crear, editar, activar, desactivar, firma, eliminar).
 *
 * Expone de cada mutación solo lo que las vistas consumen: el disparador y su
 * estado de carga. El motivo del fallo lo resuelve cada pantalla con
 * `extraerMensajeError` sobre el error capturado, salvo en la firma digital.
 */
export function useDocenteMutations() {
  const queryClient = useQueryClient()

  const invalidarConsultas = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEYS.todos })
    if (id) {
      queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEYS.detalle(id) })
    }
  }

  // Mutación: Crear docente
  const { mutateAsync: mutarCrear, isPending: estaCreando } = useMutation({
    mutationFn: (datos: SolicitudCrearDocente) => crearDocente(datos),
    onSuccess: () => invalidarConsultas(),
  })

  // Mutación: Actualizar datos personales
  const { mutateAsync: mutarActualizar, isPending: estaActualizando } = useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: SolicitudActualizarDocente }) =>
      actualizarDocente(id, datos),
    onSuccess: (_, variables) => invalidarConsultas(variables.id),
  })

  // Mutación: Cargar / actualizar firma digital.
  // Es la única que conserva su error derivado, porque DocenteFirmaUploader lo
  // muestra en el mismo recuadro que sus validaciones locales de archivo.
  const {
    mutateAsync: mutarFirma,
    isPending: estaSubiendoFirma,
    error: errorMutacionFirma,
  } = useMutation({
    mutationFn: ({ id, archivo }: { id: number; archivo: File }) =>
      actualizarFirmaDocente(id, archivo),
    onSuccess: (_, variables) => invalidarConsultas(variables.id),
  })

  // Mutación: Activar docente
  const { mutateAsync: mutarActivar, isPending: estaActivando } = useMutation({
    mutationFn: (id: number) => activarDocente(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Desactivar docente
  const { mutateAsync: mutarDesactivar, isPending: estaDesactivando } = useMutation({
    mutationFn: (id: number) => desactivarDocente(id),
    onSuccess: (_, id) => invalidarConsultas(id),
  })

  // Mutación: Eliminar docente. No invalida su detalle: el registro ya no
  // existe y refetcharlo solo produciría un 404.
  const { mutateAsync: mutarEliminar, isPending: estaEliminando } = useMutation({
    mutationFn: (id: number) => eliminarDocente(id),
    onSuccess: () => invalidarConsultas(),
  })

  return {
    crearDocente: mutarCrear,
    estaCreando,
    actualizarDocente: mutarActualizar,
    estaActualizando,
    actualizarFirma: mutarFirma,
    estaSubiendoFirma,
    errorFirma: errorMutacionFirma ? extraerMensajeError(errorMutacionFirma) : null,
    activarDocente: mutarActivar,
    estaActivando,
    desactivarDocente: mutarDesactivar,
    estaDesactivando,
    eliminarDocente: mutarEliminar,
    estaEliminando,
  }
}

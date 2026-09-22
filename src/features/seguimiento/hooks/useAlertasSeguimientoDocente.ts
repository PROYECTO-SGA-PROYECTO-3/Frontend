import { useQuery } from '@tanstack/react-query'
import { obtenerAlertasSeguimientoDocente } from '../api/seguimientoApi'
import type { EstudianteBajoRendimiento } from '../types'

export const ALERTAS_SEGUIMIENTO_DOCENTE_KEY = ['alertasSeguimientoDocente'] as const

export function useAlertasSeguimientoDocente() {
  return useQuery<EstudianteBajoRendimiento[], Error>({
    queryKey: ALERTAS_SEGUIMIENTO_DOCENTE_KEY,
    queryFn: obtenerAlertasSeguimientoDocente,
    staleTime: 1000 * 60 * 5,
  })
}

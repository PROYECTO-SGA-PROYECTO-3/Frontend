import { useQuery } from '@tanstack/react-query'
import { listarEventos } from '../api/eventosApi'
import type { EventoInstitucional } from '../types'

export const EVENTOS_INSTITUCIONALES_KEY = ['eventosInstitucionales'] as const

export function useEventosInstitucionales() {
  return useQuery<EventoInstitucional[], Error>({
    queryKey: EVENTOS_INSTITUCIONALES_KEY,
    queryFn: listarEventos,
    staleTime: 1000 * 60 * 15,
  })
}

import { useQuery } from '@tanstack/react-query'
import { obtenerNotasPorCargaYPeriodo } from '../api/notasApi'
import type { Nota } from '../types'

export const NOTAS_PLANILLA_KEY = 'notas-planilla'

export function useNotasPlanilla(
  cargaAcademicaId: number | '',
  periodoId: number | '',
) {
  const activo = typeof cargaAcademicaId === 'number' && typeof periodoId === 'number'

  return useQuery<Nota[], Error>({
    queryKey: [NOTAS_PLANILLA_KEY, cargaAcademicaId, periodoId],
    queryFn: () => {
      if (!activo) return Promise.resolve([])
      return obtenerNotasPorCargaYPeriodo(cargaAcademicaId, periodoId)
    },
    enabled: activo,
    staleTime: 1000 * 60 * 2,
  })
}

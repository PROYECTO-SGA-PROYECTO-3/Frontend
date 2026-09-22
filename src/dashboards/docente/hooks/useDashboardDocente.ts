import { useQuery } from '@tanstack/react-query'
import { obtenerDashboardDocente } from '../api'
import type { DashboardDocente } from '../types'

export const DASHBOARD_DOCENTE_KEY = ['dashboardDocente'] as const

export function useDashboardDocente() {
  return useQuery<DashboardDocente, Error>({
    queryKey: DASHBOARD_DOCENTE_KEY,
    queryFn: obtenerDashboardDocente,
    staleTime: 1000 * 60 * 5,
  })
}

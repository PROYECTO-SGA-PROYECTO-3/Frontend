import { api } from '@/shared/lib/axios'
import type { DashboardDocente } from './types'

export async function obtenerDashboardDocente(): Promise<DashboardDocente> {
  return api.get<DashboardDocente>('/dashboard/docente')
}

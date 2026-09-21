import { api } from '@/shared/lib/axios'
import type { DashboardAdmin } from './types'

export function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>('/dashboard/admin')
}

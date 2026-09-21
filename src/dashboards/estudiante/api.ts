import { api } from '@/shared/lib/axios'
import type { DashboardEstudiante } from './types'

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}

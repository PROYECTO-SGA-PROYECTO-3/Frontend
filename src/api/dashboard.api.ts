import { api } from './axios'
import type { DashboardDocente, EstudianteBajoRendimiento } from '@/types/dashboardDocente.types'

export async function obtenerDashboardDocente(): Promise<DashboardDocente> {
  return api.get<DashboardDocente>('/dashboard/docente')
}

export async function obtenerAlertasSeguimientoDocente(): Promise<EstudianteBajoRendimiento[]> {
  return api.get<EstudianteBajoRendimiento[]>('/dashboard/docente/alertas-seguimiento')
}

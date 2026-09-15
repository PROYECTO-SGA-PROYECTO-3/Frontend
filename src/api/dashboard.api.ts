import { api } from './axios'
import type { DashboardAdmin } from '@/types/dashboardAdmin.types'
import type { DashboardEstudiante } from '@/types/dashboardEstudiante.types'
import type { DashboardDocente, EstudianteBajoRendimiento } from '@/types/dashboardDocente.types'

export function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>('/dashboard/admin')
}

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante')
}

export async function obtenerDashboardDocente(): Promise<DashboardDocente> {
  return api.get<DashboardDocente>('/dashboard/docente')
}

export async function obtenerAlertasSeguimientoDocente(): Promise<EstudianteBajoRendimiento[]> {
  return api.get<EstudianteBajoRendimiento[]>('/dashboard/docente/alertas-seguimiento')
}

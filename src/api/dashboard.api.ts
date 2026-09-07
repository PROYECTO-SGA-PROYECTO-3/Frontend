import { api } from "./axios";
import type { DashboardAdmin } from "@/types/dashboardAdmin.types";
import type { DashboardEstudiante } from "@/types/dashboardEstudiante.types";

export function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>("/dashboard/admin");
}

export async function obtenerDashboardEstudiante(): Promise<DashboardEstudiante> {
  return api.get<DashboardEstudiante>('/dashboard/estudiante');
}

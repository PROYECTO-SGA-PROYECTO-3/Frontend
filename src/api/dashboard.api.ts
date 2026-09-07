import { api } from "./axios";
import type { DashboardAdmin } from "@/types/dashboardAdmin.types";

export function obtenerDashboardAdmin(): Promise<DashboardAdmin> {
  return api.get<DashboardAdmin>("/dashboard/admin");
}

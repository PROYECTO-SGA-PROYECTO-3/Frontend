import { api } from '@/shared/lib/axios'
import type { EstudianteBajoRendimiento } from '../types'

export async function obtenerAlertasSeguimientoDocente(): Promise<EstudianteBajoRendimiento[]> {
  return api.get<EstudianteBajoRendimiento[]>('/dashboard/docente/alertas-seguimiento')
}

import { api } from '@/shared/lib/axios'
import type { CalificacionesEstudiante } from '../types'

export async function obtenerCalificacionesEstudiante(): Promise<CalificacionesEstudiante> {
  return api.get<CalificacionesEstudiante>('/calificaciones/estudiante/actual')
}

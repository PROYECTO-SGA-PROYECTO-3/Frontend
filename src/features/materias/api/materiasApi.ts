import { api } from '@/shared/lib/axios'
import type { Asignatura, SolicitudCrearAsignatura } from '../types'

/**
 * Obtiene la lista completa de asignaturas registradas en la institución.
 */
export async function listarAsignaturas(): Promise<Asignatura[]> {
  return api.get<Asignatura[]>('/academico/asignaturas')
}

/**
 * Registra una nueva asignatura en el catálogo institucional.
 */
export async function crearAsignatura(datos: SolicitudCrearAsignatura): Promise<Asignatura> {
  return api.post<Asignatura>('/academico/asignaturas', datos)
}

/**
 * Actualiza el nombre de una asignatura existente.
 */
export async function actualizarAsignatura(
  id: number,
  datos: SolicitudCrearAsignatura,
): Promise<Asignatura> {
  return api.put<Asignatura>(`/academico/asignaturas/${id}`, datos)
}

/**
 * Elimina una asignatura del catálogo institucional.
 * Falla si la asignatura tiene cargas académicas asignadas en algún año lectivo.
 */
export async function eliminarAsignatura(id: number): Promise<void> {
  await api.delete(`/academico/asignaturas/${id}`)
}

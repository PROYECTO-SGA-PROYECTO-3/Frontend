import { api } from '@/shared/lib/axios'
import type { PaginaSpring } from '@/shared/types/api.types'
import type { Grado } from '@/shared/types/academico.types'
import type {
  Estudiante,
  ParametrosListarEstudiantes,
  SolicitudActualizarEstudiante,
  SolicitudCrearEstudiante,
} from '../types'

/**
 * Obtiene el listado paginado y filtrado de estudiantes desde el servidor.
 */
export async function listarEstudiantes({
  pagina = 0,
  tamanoPagina = 10,
  incluirInactivos = true,
  termino,
  gradoId,
  sortBy = 'PRIMER_NOMBRE',
  direction = 'ASC',
}: ParametrosListarEstudiantes = {}): Promise<PaginaSpring<Estudiante>> {
  return api.get<PaginaSpring<Estudiante>>('/estudiantes', {
    params: {
      page: pagina,
      size: tamanoPagina,
      sortBy,
      direction,
      incluirInactivos,
      ...(termino?.trim() ? { termino: termino.trim() } : {}),
      ...(gradoId ? { gradoId } : {}),
    },
  })
}

export async function listarGrados(): Promise<Grado[]> {
  return api.get<Grado[]>('/academico/grados')
}

export async function crearEstudiante(datos: SolicitudCrearEstudiante): Promise<Estudiante> {
  return api.post<Estudiante>('/estudiantes', datos)
}

export async function obtenerEstudiante(id: number): Promise<Estudiante> {
  return api.get<Estudiante>(`/estudiantes/${id}`)
}

export async function actualizarEstudiante(
  id: number,
  datos: SolicitudActualizarEstudiante,
): Promise<Estudiante> {
  return api.put<Estudiante>(`/estudiantes/${id}`, datos)
}

export async function desactivarEstudiante(id: number): Promise<void> {
  await api.patch(`/estudiantes/${id}/desactivar`)
}

export async function activarEstudiante(id: number): Promise<void> {
  await api.patch(`/estudiantes/${id}/activar`)
}

export async function eliminarEstudiante(id: number): Promise<void> {
  await api.delete(`/estudiantes/${id}`)
}
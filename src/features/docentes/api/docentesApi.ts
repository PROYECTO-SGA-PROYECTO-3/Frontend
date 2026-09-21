import { api } from '@/shared/lib/axios'
import type { PaginaSpring } from '@/shared/types/api.types'
import type {
  Docente,
  ParametrosListarDocentes,
  SolicitudActualizarDocente,
  SolicitudCrearDocente,
} from '../types'

/**
 * Consulta la lista paginada de docentes con filtros de orden y vigencia.
 */
export async function listarDocentes({
  pagina = 0,
  tamanoPagina = 10,
  incluirInactivos = true,
  sortBy = 'PRIMER_NOMBRE',
  direction = 'ASC',
}: ParametrosListarDocentes = {}): Promise<PaginaSpring<Docente>> {
  return api.get<PaginaSpring<Docente>>('/docentes', {
    params: {
      page: pagina,
      size: tamanoPagina,
      sortBy,
      direction,
      incluirInactivos,
    },
  })
}

/**
 * Obtiene el detalle completo de un docente por su ID único.
 */
export async function obtenerDocente(id: number): Promise<Docente> {
  return api.get<Docente>(`/docentes/${id}`)
}

/**
 * Registra un nuevo docente en el sistema institucional.
 */
export async function crearDocente(datos: SolicitudCrearDocente): Promise<Docente> {
  return api.post<Docente>('/docentes', datos)
}

/**
 * Actualiza la información personal de un docente existente.
 */
export async function actualizarDocente(
  id: number,
  datos: SolicitudActualizarDocente,
): Promise<Docente> {
  return api.put<Docente>(`/docentes/${id}`, datos)
}

/**
 * Carga o actualiza el archivo de imagen de la firma digital del docente.
 */
export async function actualizarFirmaDocente(id: number, archivo: File): Promise<Docente> {
  const formData = new FormData()
  formData.append('firma', archivo)
  return api.put<Docente>(`/docentes/${id}/firma`, formData)
}

/**
 * Reactiva a un docente inactivo para permitirle acceso y asignaciones.
 */
export async function activarDocente(id: number): Promise<void> {
  await api.patch(`/docentes/${id}/activar`)
}

/**
 * Desactiva temporalmente a un docente impidiendo su acceso al sistema.
 */
export async function desactivarDocente(id: number): Promise<void> {
  await api.patch(`/docentes/${id}/desactivar`)
}

/**
 * Elimina definitivamente a un docente (solo permitido si está inactivo y no tiene cargas).
 */
export async function eliminarDocente(id: number): Promise<void> {
  await api.delete(`/docentes/${id}`)
}

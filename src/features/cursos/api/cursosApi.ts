import { api } from '@/shared/lib/axios'
import type { Grado, SolicitudGrado } from '@/shared/types/academico.types'
import type { Matricula } from '@/shared/types/matricula.types'

export async function listarGrados(): Promise<Grado[]> {
  return api.get<Grado[]>('/academico/grados')
}

export async function obtenerGrado(id: number): Promise<Grado> {
  return api.get<Grado>(`/academico/grados/${id}`)
}

export async function crearGrado(datos: SolicitudGrado): Promise<Grado> {
  return api.post<Grado>('/academico/grados', datos)
}

export async function actualizarGrado(
  id: number,
  datos: SolicitudGrado,
): Promise<Grado> {
  return api.put<Grado>(`/academico/grados/${id}`, datos)
}

export async function eliminarGrado(id: number): Promise<void> {
  await api.delete(`/academico/grados/${id}`)
}

export async function listarEstudiantesPorGrado(
  gradoId: number,
  anio?: number,
): Promise<Matricula[]> {
  return api.get<Matricula[]>(`/matriculas/grado/${gradoId}`, {
    params: anio ? { anio } : undefined,
  })
}

export async function matricularEstudianteEnCurso(
  datos: { documentoEstudiante: string; gradoId: number; anio?: number },
): Promise<Matricula> {
  return api.post<Matricula>('/matriculas', datos)
}

import { api } from './axios'
import type { AnioLectivo, SolicitudAnioLectivo } from '@/types/anioLectivo.types'

export async function listarAniosLectivos(): Promise<AnioLectivo[]> {
  return api.get<AnioLectivo[]>('/anios-lectivos')
}

export async function crearAnioLectivo(datos: SolicitudAnioLectivo): Promise<AnioLectivo> {
  return api.post<AnioLectivo>('/anios-lectivos', datos)
}

export async function actualizarAnioLectivo(id: number, datos: SolicitudAnioLectivo): Promise<AnioLectivo> {
  return api.put<AnioLectivo>(`/anios-lectivos/${id}`, datos)
}

export async function activarAnioLectivo(id: number): Promise<AnioLectivo[]> {
  const anios = await listarAniosLectivos()
  const objetivo = anios.find((anio) => anio.id === id)

  if (!objetivo) {
    throw new Error('Año lectivo no encontrado')
  }

  if (!objetivo.activo) {
    const actual = anios.find((anio) => anio.activo)

    if (actual) {
      await actualizarAnioLectivo(actual.id, { anio: actual.anio, activo: false })
      try {
        await actualizarAnioLectivo(objetivo.id, { anio: objetivo.anio, activo: true })
      } catch (error) {
        await actualizarAnioLectivo(actual.id, { anio: actual.anio, activo: true }).catch(() => {})
        throw error
      }
    } else {
      await actualizarAnioLectivo(objetivo.id, { anio: objetivo.anio, activo: true })
    }
  }

  return listarAniosLectivos()
}

import { api } from './axios'
import type { Institucion, SolicitudActualizarInstitucion } from '@/types/institucion.types'

export async function obtenerInstitucion(): Promise<Institucion> {
  return api.get<Institucion>('/institucion')
}

export async function actualizarInstitucion(datos: SolicitudActualizarInstitucion): Promise<Institucion> {
  return api.put<Institucion>('/institucion', datos)
}

export async function subirSelloInstitucion(archivo: File): Promise<Institucion> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/sello', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function subirLogoInstitucion(archivo: File): Promise<Institucion> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function subirFirmaRector(archivo: File): Promise<Institucion> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/firma', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function subirBanderaInstitucion(archivo: File): Promise<Institucion> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<Institucion>('/institucion/bandera', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

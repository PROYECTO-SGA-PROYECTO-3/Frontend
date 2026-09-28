import axios from 'axios'
import { api, extraerMensajeErrorDescarga, extraerNombreArchivoDescarga } from '@/shared/lib/axios'
import type { CargaAcademica, Periodo } from '@/shared/types/academico.types'
import type {
  ErrorFilaImportacion,
  Nota,
  NotaDefinitiva,
  ResultadoImportacionNotas,
  ResultadoPreviewImportacion,
} from '../types'

export async function obtenerNotasDefinitivas(matriculaId: number): Promise<NotaDefinitiva[]> {
  return api.get<NotaDefinitiva[]>(`/notas/definitivas/${matriculaId}`)
}

export async function habilitarNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/habilitar`)
}

export async function bloquearNota(id: number): Promise<void> {
  await api.patch(`/notas/${id}/bloquear`)
}

// Autoservicio: cargas académicas del docente autenticado en el año lectivo activo
export async function listarMisCargas(): Promise<CargaAcademica[]> {
  return api.get<CargaAcademica[]>('/carga-academica/mis-cargas')
}

// Autoservicio: periodos del año lectivo activo accesibles para el docente
export async function listarPeriodosActivos(): Promise<Periodo[]> {
  return api.get<Periodo[]>('/notas/periodos')
}

// Obtener notas de todos los matriculados para una carga académica y periodo
export async function obtenerNotasPorCargaYPeriodo(
  cargaAcademicaId: number,
  periodoId: number,
): Promise<Nota[]> {
  return api.get<Nota[]>(`/notas/carga/${cargaAcademicaId}/periodo/${periodoId}`)
}

export interface DescargaPlantilla {
  archivo: Blob
  nombreArchivo: string
}

export async function descargarPlantilla(
  cargaAcademicaId: number,
  periodoId: number,
): Promise<DescargaPlantilla> {
  const respuesta = await api.getBlob('/notas/plantilla', {
    params: { cargaAcademicaId, periodoId },
  })
  return {
    archivo: respuesta.data,
    nombreArchivo:
      extraerNombreArchivoDescarga(respuesta.headers['content-disposition']) ?? 'plantilla.xlsx',
  }
}

export async function previsualizarImportacion(
  cargaAcademicaId: number,
  periodoId: number,
  archivo: File,
): Promise<ResultadoPreviewImportacion> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<ResultadoPreviewImportacion>('/notas/importar/previsualizar', formData, {
    params: { cargaAcademicaId, periodoId },
  })
}

export async function importarNotas(
  cargaAcademicaId: number,
  periodoId: number,
  archivo: File,
): Promise<ResultadoImportacionNotas> {
  const formData = new FormData()
  formData.append('archivo', archivo)
  return api.post<ResultadoImportacionNotas>('/notas/importar', formData, {
    params: { cargaAcademicaId, periodoId },
  })
}

export function extraerErroresImportacion(error: unknown): ErrorFilaImportacion[] | null {
  if (axios.isAxiosError<{ errores?: ErrorFilaImportacion[] }>(error)) {
    return error.response?.data?.errores ?? null
  }
  return null
}

export async function extraerMensajeErrorDescargaPlantilla(error: unknown): Promise<string> {
  return extraerMensajeErrorDescarga(error, 'No se pudo descargar la plantilla.')
}

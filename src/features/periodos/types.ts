export type { Periodo } from '@/shared/types/academico.types'

export interface SolicitudPeriodo {
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  anioLectivoId: number
}

export interface CierrePeriodoResumen {
  nombrePeriodo: string | null
  porcentajeCompletado: number
  diasRestantes: number
  planillasSinCalificar: number
}

export interface Periodo {
  id: number
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  cerradoParaDocentes: boolean
  anioLectivoId: number
}

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

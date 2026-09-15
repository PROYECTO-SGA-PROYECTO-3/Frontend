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

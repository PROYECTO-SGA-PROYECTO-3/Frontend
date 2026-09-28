export interface Asignatura {
  id: number
  nombre: string
}

export interface SolicitudAsignatura {
  nombre: string
}

export interface Grado {
  id: number
  nombre: string
  directorId: number | null
}

export interface SolicitudGrado {
  nombre: string
  directorId: number
}

export interface CargaAcademica {
  id: number
  docenteId: number
  nombreDocente: string
  documentoDocente: string
  asignaturaId: number
  nombreAsignatura: string
  gradoId: number
  nombreGrado: string
  anioLectivo: number
}

export interface SolicitudCrearCarga {
  docenteId: number
  asignaturaId: number
  gradoId: number
  anio?: number
}

export interface SolicitudReasignarDocente {
  docenteId: number
}

export interface Periodo {
  id: number
  nombre: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  cerradoParaDocentes: boolean
  anioLectivoId: number
}

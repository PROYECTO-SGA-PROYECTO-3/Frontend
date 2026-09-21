export interface Docente {
  id: number
  documento: string
  email: string
  primerNombre: string
  segundoNombre: string | null
  primerApellido: string
  segundoApellido: string | null
  firmaUrl: string | null
  activo: boolean
  materias: string[]
}

export interface SolicitudCrearDocente {
  documento: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  email: string
  contrasena: string
}

export interface SolicitudActualizarDocente {
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
}

export interface ParametrosListarDocentes {
  pagina?: number
  tamanoPagina?: number
  incluirInactivos?: boolean
  sortBy?: 'PRIMER_NOMBRE' | 'PRIMER_APELLIDO' | 'DOCUMENTO'
  direction?: 'ASC' | 'DESC'
}

export type FiltroEstadoDocente = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'
export type FiltroFirmaDocente = 'TODOS' | 'CON_FIRMA' | 'SIN_FIRMA'
export type OrdenDocente = 'NOMBRE_ASC' | 'NOMBRE_DESC' | 'DOCUMENTO_ASC'

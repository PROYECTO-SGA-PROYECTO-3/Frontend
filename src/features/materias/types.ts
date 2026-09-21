export interface Asignatura {
  id: number
  nombre: string
}

export interface SolicitudCrearAsignatura {
  nombre: string
}

export type CriterioOrdenMateria = 'alfabetico-asc' | 'alfabetico-desc' | 'recientes'

export type CriterioOrdenCurso = 'nombre-asc' | 'nombre-desc' | 'id-asc' | 'id-desc'

export interface FiltrosCurso {
  busqueda: string
  estadoDirector?: 'TODOS' | 'CON_DIRECTOR' | 'SIN_DIRECTOR'
  orden?: CriterioOrdenCurso
}

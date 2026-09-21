export interface ClaseHoyDocente {
  id: number
  asignatura: string
  grado: string
  horaInicio: string
  horaFin: string
  cantidadEstudiantes: number
}

export interface AsignaturaHoy {
  id: number
  nombre: string
  horaInicio: string
  horaFin: string
}

import type { EstadoMatricula } from '@/shared/types/matricula.types'
export type { EstadoMatricula } from '@/shared/types/matricula.types'

export type NivelPromedio = 'BAJO' | 'BASICO' | 'ALTO' | 'SUPERIOR'

export interface ResumenPromedio {
  valor: number
  nivel: NivelPromedio
  variacionPeriodoAnterior: number
  historicoPeriodos: number[]
}

export interface ResumenAnioLectivoCalificaciones {
  anio: number | null
  gradoNombre: string
  // Null solo cuando el estudiante no tiene matrícula en el año lectivo activo.
  estadoMatricula: EstadoMatricula | null
  directorGrupo: string | null
  periodoActual: string | null
}

export interface ResumenAcademico {
  promedioGeneral: number
  variacionPeriodoAnterior: number
  asignaturasAprobadas: number
  totalAsignaturas: number
  puestoEnGrupo: number | null
  totalEstudiantesGrupo: number
  pendientesAcademicos: number
}

export interface NotaPeriodo {
  nombrePeriodo: string
  valor: number
}

export interface AsignaturaCalificacion {
  cargaAcademicaId: number
  nombreAsignatura: string
  nombreDocente: string
  notasPorPeriodo: NotaPeriodo[]
  notaFinal: number | null
}

export interface CalificacionesEstudiante {
  anioLectivo: ResumenAnioLectivoCalificaciones
  resumen: ResumenAcademico
  asignaturas: AsignaturaCalificacion[]
}

export interface DetalleNotaPeriodo {
  id: number
  nombrePeriodo: string
  porcentaje: number
  valor: number
  aporte: number
}

export interface NotaDefinitiva {
  nombreAsignatura: string
  cargaAcademicaId: number
  notasPorPeriodo: DetalleNotaPeriodo[]
  notaDefinitiva: number | null
}

export interface Nota {
  id: number | null
  matriculaId: number
  documentoEstudiante: string
  nombreEstudiante: string
  cargaAcademicaId: number
  nombreAsignatura: string
  periodoId: number
  nombrePeriodo: string
  valor: number | null
  habilitadaParaEdicion: boolean
}

export interface ResultadoImportacionNotas {
  notasCreadas: number
  notasActualizadas: number
}

export interface ErrorFilaImportacion {
  fila: number
  documento: string
  mensaje: string
}

export interface FilaPreviewImportacion {
  documento: string
  nombreEstudiante: string
  notaActual: number | null
  notaNueva: number
  actualizacion: boolean
}

export interface ResultadoPreviewImportacion {
  filas: FilaPreviewImportacion[]
  totalCreaciones: number
  totalActualizaciones: number
}

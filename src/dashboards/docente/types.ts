export interface ResumenDocenteDashboard {
  nombreCompleto: string
  cargo: string
}


export interface CierrePeriodoResumen {
  nombrePeriodo: string | null
  porcentajeCompletado: number
  diasRestantes: number
  planillasSinCalificar: number
}

export interface EstudianteBajoRendimiento {
  estudianteId: number
  nombreCompleto: string
  gradoNombre: string
  nombreAsignatura: string
  promedio: number
}

export interface DashboardDocente {
  docente: ResumenDocenteDashboard
  planillasPendientes: number
  cierrePeriodo: CierrePeriodoResumen
  estudiantesBajoRendimiento: EstudianteBajoRendimiento[]
}

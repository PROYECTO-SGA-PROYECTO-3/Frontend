export interface UbicacionClima {
  nombre: string
  municipio: string
  departamento?: string
  pais?: string
  latitud: number
  longitud: number
  esTiempoReal?: boolean
}

export interface CondicionClimatica {
  codigo: number
  descripcion: string
  icono: string
  esDia: boolean
}

export interface ClimaActual {
  temperatura: number
  sensacionTermica: number
  humedadRelativa: number
  vientoVelocidad: number
  codigoClima: number
  esDia: boolean
  condicion: CondicionClimatica
  ultimaActualizacion: Date
}

export interface ClimaResultado {
  ubicacion: UbicacionClima
  actual: ClimaActual
}

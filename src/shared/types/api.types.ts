/** Estructura de paginación que devuelve Spring Boot */
export interface PaginaSpring<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

/** Error genérico de la API (ver RespuestaError en Swagger) */
export interface ErrorApi {
  error: string
  mensaje: string
  timestamp: string
}

/** Error de validación (400): un mensaje por campo */
export interface ErrorValidacion {
  error: string
  campos: Record<string, string>
  timestamp: string
}

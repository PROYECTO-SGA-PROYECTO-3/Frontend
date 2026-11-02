import type { ParametrosListarEstudiantes } from '../types'

/**
 * Claves de caché del módulo de estudiantes, declaradas en un solo lugar.
 *
 * Las listas y los candidatos cuelgan de `todos`, así que invalidar esa raíz
 * refresca ambos tras cualquier mutación. El detalle vive en su propia raíz,
 * y por eso las mutaciones lo invalidan de forma explícita.
 */
export const ESTUDIANTES_QUERY_KEYS = {
  todos: ['estudiantes'] as const,
  lista: (parametros: ParametrosListarEstudiantes) =>
    [...ESTUDIANTES_QUERY_KEYS.todos, parametros] as const,
  candidatos: (termino: string, limite: number) =>
    [...ESTUDIANTES_QUERY_KEYS.todos, 'candidatos', termino, limite] as const,
  detalle: (id: number | null | undefined) => ['estudiante-detalle', id] as const,
  grados: ['grados-catalogo'] as const,
} as const

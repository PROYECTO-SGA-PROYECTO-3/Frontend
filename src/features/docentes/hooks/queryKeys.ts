import type { ParametrosListarDocentes } from '../types'

/**
 * Claves de caché del módulo de docentes, declaradas en un solo lugar.
 *
 * El listado paginado, el catálogo liviano y el resumen agregado cuelgan de
 * `todos`, así que invalidar esa raíz los refresca tras cualquier mutación.
 * El detalle vive en su propia raíz, y por eso las mutaciones lo invalidan de
 * forma explícita.
 */
export const DOCENTES_QUERY_KEYS = {
  todos: ['docentes'] as const,
  lista: (parametros: ParametrosListarDocentes) =>
    [...DOCENTES_QUERY_KEYS.todos, parametros] as const,
  catalogo: (incluirInactivos: boolean) =>
    [...DOCENTES_QUERY_KEYS.todos, 'catalogo', incluirInactivos] as const,
  resumen: () => [...DOCENTES_QUERY_KEYS.todos, 'resumen'] as const,
  detalle: (id: number | null | undefined) => ['docente-detalle', id] as const,
} as const

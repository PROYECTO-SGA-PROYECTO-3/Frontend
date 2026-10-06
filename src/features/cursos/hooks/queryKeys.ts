export const CURSOS_QUERY_KEYS = {
  todos: ['cursos'] as const,
  listas: () => [...CURSOS_QUERY_KEYS.todos, 'lista'] as const,
  detalle: (id: number) => [...CURSOS_QUERY_KEYS.todos, 'detalle', id] as const,
  estudiantes: (gradoId: number, anio?: number) =>
    [...CURSOS_QUERY_KEYS.todos, 'estudiantes', gradoId, anio] as const,
  cargas: (gradoId: number, anio?: number) =>
    [...CURSOS_QUERY_KEYS.todos, 'cargas', gradoId, anio] as const,
} as const


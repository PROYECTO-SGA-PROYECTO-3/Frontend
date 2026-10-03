export const CURSOS_QUERY_KEYS = {
  todos: ['cursos'] as const,
  listas: () => [...CURSOS_QUERY_KEYS.todos, 'lista'] as const,
  detalle: (id: number) => [...CURSOS_QUERY_KEYS.todos, 'detalle', id] as const,
} as const

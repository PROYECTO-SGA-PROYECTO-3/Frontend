import { describe, it, expect } from 'vitest'
import { ESTUDIANTES_QUERY_KEYS } from '@/features/estudiantes/hooks/queryKeys'

/**
 * Las claves de caché son un contrato: si cambian, las mutaciones dejan de invalidar
 * las consultas correctas y la tabla se queda con datos viejos sin ningún error visible.
 */
describe('ESTUDIANTES_QUERY_KEYS', () => {
  it('mantiene la raíz de la que cuelgan listas y candidatos', () => {
    expect(ESTUDIANTES_QUERY_KEYS.todos).toEqual(['estudiantes'])
  })

  it('arma la clave de la lista con los parámetros de la consulta', () => {
    const parametros = { pagina: 0, tamanoPagina: 10, activo: false }
    expect(ESTUDIANTES_QUERY_KEYS.lista(parametros)).toEqual(['estudiantes', parametros])
  })

  it('cuelga los candidatos de la misma raíz, para que una mutación los invalide', () => {
    expect(ESTUDIANTES_QUERY_KEYS.candidatos('ana', 5)).toEqual([
      'estudiantes',
      'candidatos',
      'ana',
      5,
    ])
    expect(ESTUDIANTES_QUERY_KEYS.candidatos('ana', 5)[0]).toBe(ESTUDIANTES_QUERY_KEYS.todos[0])
  })

  it('mantiene el detalle en su propia raíz', () => {
    expect(ESTUDIANTES_QUERY_KEYS.detalle(7)).toEqual(['estudiante-detalle', 7])
  })

  it('mantiene la clave del catálogo de grados', () => {
    expect(ESTUDIANTES_QUERY_KEYS.grados).toEqual(['grados-catalogo'])
  })
})

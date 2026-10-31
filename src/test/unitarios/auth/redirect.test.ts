import { describe, expect, it } from 'vitest'
import { resolverRutaDestino } from '@/features/auth/utils/redirect'

describe('Redirección Segura Posterior al Inicio de Sesión', () => {
  it('devuelve al usuario a la pantalla interna donde se le venció la sesión, con sus filtros intactos', () => {
    expect(resolverRutaDestino('/docente/planilla', 'DOCENTE')).toBe('/docente/planilla')
    expect(resolverRutaDestino('/admin/estudiantes?pagina=2', 'ADMIN')).toBe(
      '/admin/estudiantes?pagina=2',
    )
  })

  it('descarta cualquier destino ajeno a la plataforma y lo lleva al panel de su perfil', () => {
    expect(resolverRutaDestino('https://sitio-falso.test/captura', 'ADMIN')).toBe('/admin')
    expect(resolverRutaDestino('//sitio-falso.test', 'DOCENTE')).toBe('/docente')
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuthStore } from '../store'
import { useAuthorization } from './useAuthorization'
import { crearUsuarioConRol } from '@/test/fixtures'

describe('Autorización y Control de Acceso por Rol', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      motivoCierre: null,
    })
  })

  it('bloquea el acceso a funcionalidades protegidas cuando no hay sesión iniciada', () => {
    const { result } = renderHook(() => useAuthorization())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.rol).toBeUndefined()
    expect(result.current.hasRole('ADMIN')).toBe(false)
    expect(result.current.hasAnyRole(['ADMIN', 'DOCENTE'])).toBe(false)
  })

  it('permite el acceso únicamente a las secciones asignadas al rol del usuario', () => {
    useAuthStore.getState().setSesion('token-doc', crearUsuarioConRol('DOCENTE'))

    const { result } = renderHook(() => useAuthorization())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.rol).toBe('DOCENTE')
    expect(result.current.hasRole('DOCENTE')).toBe(true)
    expect(result.current.hasRole('ADMIN')).toBe(false)
    
  })

  it('autoriza la acción si el perfil del usuario pertenece al grupo de roles permitidos', () => {
    useAuthStore.getState().setSesion('token-est', crearUsuarioConRol('ESTUDIANTE'))

    const { result } = renderHook(() => useAuthorization())

    expect(result.current.hasAnyRole(['DOCENTE', 'ADMIN'])).toBe(false)
    expect(result.current.hasAnyRole(['ADMIN', 'ESTUDIANTE'])).toBe(true)
  })
})

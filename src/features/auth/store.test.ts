import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './store'
import { queryClient } from '@/shared/lib/query-client'
import { crearUsuarioMock } from '@/test/fixtures'

describe('Control de Sesión de Usuario', () => {
  const usuarioMock = crearUsuarioMock()

  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      motivoCierre: null,
    })
  })

  it('inicia la aplicación sin ninguna sesión activa', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.usuario).toBeNull()
  })

  it('establece la sesión activa al suministrar credenciales válidas', () => {
    useAuthStore.getState().setSesion('token-xyz', usuarioMock)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('token-xyz')
    expect(state.usuario).toEqual(usuarioMock)
  })

  it('desconecta al usuario, registra el motivo de salida y purga los datos en memoria', () => {
    const spyClear = vi.spyOn(queryClient, 'clear')

    useAuthStore.getState().setSesion('token-xyz', usuarioMock)
    useAuthStore.getState().cerrarSesion('expirada')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
    expect(state.usuario).toBeNull()
    expect(state.motivoCierre).toBe('expirada')
    expect(spyClear).toHaveBeenCalledTimes(1)

    spyClear.mockRestore()
  })

  it('descarta el aviso de motivo de cierre una vez notificado', () => {
    useAuthStore.getState().cerrarSesion('voluntario')
    expect(useAuthStore.getState().motivoCierre).toBe('voluntario')

    useAuthStore.getState().limpiarMotivo()
    expect(useAuthStore.getState().motivoCierre).toBeNull()
  })
})

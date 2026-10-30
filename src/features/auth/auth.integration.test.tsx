import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@/test/TestWrapper'
import Login from './pages/LoginPage'
import { useAuthStore } from './store'
import { admin, docente } from '@/test/fixtures/usuarios'

describe('Integración: Pantalla de Login y Autenticación', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      motivoCierre: null,
    })
  })

  it('inicia sesión con credenciales de docente y activa el rol correspondiente', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    )

    await user.type(screen.getByLabelText(/documento/i), docente.credenciales.documento)
    await user.type(screen.getByLabelText(/contraseña/i), docente.credenciales.contrasena)
    await user.click(screen.getByRole('button', { name: /ingresar a la plataforma/i }))

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe(docente.respuesta.token)
      expect(state.usuario?.rol).toBe('DOCENTE')
    })
  })

  it('inicia sesión con credenciales de administrador y activa el rol correspondiente', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    )

    await user.type(screen.getByLabelText(/documento/i), admin.credenciales.documento)
    await user.type(screen.getByLabelText(/contraseña/i), admin.credenciales.contrasena)
    await user.click(screen.getByRole('button', { name: /ingresar a la plataforma/i }))

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.token).toBe(admin.respuesta.token)
      expect(state.usuario?.rol).toBe('ADMIN')
    })
  })

  it('muestra mensaje de error si las credenciales son incorrectas', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    )

    await user.type(screen.getByLabelText(/documento/i), '9999999999')
    await user.type(screen.getByLabelText(/contraseña/i), 'clave-erronea')
    await user.click(screen.getByRole('button', { name: /ingresar a la plataforma/i }))

    expect(
      await screen.findByText(/número de documento o contraseña incorrectos/i),
    ).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('valida en el cliente que el documento y la contraseña sean obligatorios', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    )

    await user.click(screen.getByRole('button', { name: /ingresar a la plataforma/i }))

    expect(await screen.findByText(/ingresa tu número de documento/i)).toBeInTheDocument()
    expect(await screen.findByText(/ingresa tu contraseña/i)).toBeInTheDocument()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('muestra aviso de advertencia si el usuario llega con la sesión expirada', () => {
    useAuthStore.setState({ motivoCierre: 'expirada' })

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>,
    )

    expect(
      screen.getByText(/tu sesión ha expirado por seguridad/i),
    ).toBeInTheDocument()
  })
})

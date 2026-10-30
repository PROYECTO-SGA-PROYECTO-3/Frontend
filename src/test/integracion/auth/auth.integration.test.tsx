import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TestWrapper } from '@/test/utils/TestWrapper'
import { iniciarServidorMsw } from '@/test/utils/server'
import { admin, docente, estudiante } from '@/test/utils/fixtures/usuarios'
import Login from '@/features/auth/pages/LoginPage'
import { useAuthStore } from '@/features/auth/store'

describe('Integración: Pantalla de Login y Autenticación', () => {
  // Activa y gestiona el ciclo de vida del servidor de red simulada (MSW)
  iniciarServidorMsw()

  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      usuario: null,
      isAuthenticated: false,
      motivoCierre: null,
    })
  })

  const casosLoginExitoso = [
    { rol: 'DOCENTE', descripcion: 'docente', fixture: docente },
    { rol: 'ADMIN', descripcion: 'administrador', fixture: admin },
    { rol: 'ESTUDIANTE', descripcion: 'estudiante', fixture: estudiante },
  ] as const

  it.each(casosLoginExitoso)(
    'inicia sesión con credenciales de $descripcion y activa el rol correspondiente',
    async ({ rol, fixture }) => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Login />
        </TestWrapper>,
      )

      await user.type(screen.getByLabelText(/documento/i), fixture.credenciales.documento)
      await user.type(screen.getByLabelText(/contraseña/i), fixture.credenciales.contrasena)
      await user.click(screen.getByRole('button', { name: /ingresar a la plataforma/i }))

      await waitFor(() => {
        const state = useAuthStore.getState()
        expect(state.isAuthenticated).toBe(true)
        expect(state.token).toBe(fixture.respuesta.token)
        expect(state.usuario?.rol).toBe(rol)
      })
    },
  )

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

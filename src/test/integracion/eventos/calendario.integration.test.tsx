import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { TestWrapper } from '@/test/utils/TestWrapper'
import { iniciarServidorMsw, server } from '@/test/utils/server'
import { admin, docente } from '@/test/utils/fixtures/usuarios'
import { useAuthStore } from '@/features/auth/store'
import CalendarioPage from '@/features/eventos/pages/CalendarioPage'

describe('Integración: Calendario Institucional y Autorización en la Interfaz', () => {
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

  const renderizarCalendario = () =>
    render(
      <TestWrapper initialEntries={['/admin/calendario']}>
        <CalendarioPage />
      </TestWrapper>,
    )

  it('permite programar eventos al administrador y entrega el mismo calendario en solo lectura al docente', async () => {
    server.use(
      http.get('*/eventos', () =>
        HttpResponse.json([
          {
            id: 1,
            titulo: 'Izada de bandera',
            descripcion: 'Acto cívico en la cancha principal.',
            fecha: '2026-11-15',
            lugar: 'Cancha principal',
          },
        ]),
      ),
    )

    // El administrador consulta el calendario y dispone de las acciones de gestión
    useAuthStore.setState({
      token: 'token-valido-admin',
      usuario: admin.respuesta,
      isAuthenticated: true,
    })

    const vistaAdministrador = renderizarCalendario()

    expect(await screen.findByText('Izada de bandera')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nuevo evento/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /eliminar evento: izada de bandera/i }),
    ).toBeInTheDocument()

    vistaAdministrador.unmount()

    // El mismo calendario, consultado por un docente, no ofrece ninguna acción de escritura
    useAuthStore.setState({
      token: 'token-valido-docente',
      usuario: docente.respuesta,
      isAuthenticated: true,
    })

    renderizarCalendario()

    expect(await screen.findByText('Izada de bandera')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /nuevo evento/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /eliminar evento: izada de bandera/i }),
    ).not.toBeInTheDocument()
  })
})

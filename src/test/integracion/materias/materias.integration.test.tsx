import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { TestWrapper } from '@/test/utils/TestWrapper'
import { iniciarServidorMsw, server } from '@/test/utils/server'
import MateriasPage from '@/features/materias/pages/MateriasPage'

describe('Integración: Catálogo Maestro de Asignaturas', () => {
  // Activa y gestiona el ciclo de vida del servidor de red simulada (MSW)
  iniciarServidorMsw()

  const renderizarCatalogo = () =>
    render(
      <TestWrapper initialEntries={['/admin/materias']}>
        <MateriasPage />
      </TestWrapper>,
    )

  it('registra una nueva asignatura y la refleja de inmediato en el catálogo', async () => {
    const user = userEvent.setup()

    // El catálogo vive en el "servidor": la creación lo modifica y la recarga lo confirma
    const catalogoEnServidor = [{ id: 1, nombre: 'Matemáticas' }]

    server.use(
      http.get('*/academico/asignaturas', () => HttpResponse.json(catalogoEnServidor)),
      http.post<never, { nombre: string }>('*/academico/asignaturas', async ({ request }) => {
        const { nombre } = await request.json()
        const registrada = { id: 2, nombre }
        catalogoEnServidor.push(registrada)
        return HttpResponse.json(registrada, { status: 201 })
      }),
    )

    renderizarCatalogo()

    expect(await screen.findByText('Matemáticas')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /nueva materia/i }))
    await user.type(screen.getByLabelText(/nombre de la asignatura/i), 'Física')
    await user.click(screen.getByRole('button', { name: /registrar asignatura/i }))

    // Aparece en la tabla porque la caché se invalidó y el listado se volvió a consultar
    expect(await screen.findByText('Física')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/registrada con éxito/i)
  })

  it('conserva la asignatura cuando el servidor rechaza su eliminación por tener carga académica', async () => {
    const user = userEvent.setup()

    server.use(
      http.get('*/academico/asignaturas', () =>
        HttpResponse.json([{ id: 1, nombre: 'Matemáticas' }]),
      ),
      http.delete('*/academico/asignaturas/1', () =>
        HttpResponse.json(
          { mensaje: 'La asignatura está asignada a un docente en el año lectivo activo.' },
          { status: 409 },
        ),
      ),
    )

    renderizarCatalogo()

    await user.click(await screen.findByRole('button', { name: /eliminar matemáticas/i }))
    await user.click(screen.getByRole('button', { name: /eliminar del catálogo/i }))

    // El motivo del backend se muestra en el propio diálogo, que permanece abierto
    expect(
      await screen.findByText(/asignada a un docente en el año lectivo activo/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Matemáticas')).toBeInTheDocument()
  })
})

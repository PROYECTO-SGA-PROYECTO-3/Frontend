import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { TestWrapper } from '@/test/utils/TestWrapper'
import { iniciarServidorMsw, server } from '@/test/utils/server'
import { EstudiantesPage } from '@/features/estudiantes/pages/EstudiantesPage'
import type { Estudiante } from '@/features/estudiantes/types'

function crearEstudianteMock(parcial: Partial<Estudiante> = {}): Estudiante {
    return {
        id: 1,
        documento: '1020304050',
        primerNombre: 'Ana',
        segundoNombre: 'Maria',
        primerApellido: 'Torres',
        segundoApellido: 'Ruiz',
        activo: true,
        gradoActualId: 1,
        gradoActualNombre: 'Décimo',
        ultimaMatriculaGrado: null,
        ultimaMatriculaEstado: null,
        ...parcial,
    }
}

function paginaDe(estudiantes: Estudiante[]) {
    return {
        content: estudiantes,
        page: {
            size: 10,
            number: 0,
            totalElements: estudiantes.length,
            totalPages: 1,
        },
    }
}

const gradosHandler = http.get('*/academico/grados', () => HttpResponse.json([]))

describe('Integración: Directorio de Estudiantes', () => {
    iniciarServidorMsw()

    it('muestra en la tabla los estudiantes que entrega el servidor', async () => {
        server.use(
            gradosHandler,
            http.get('*/estudiantes', () =>
                HttpResponse.json(
                    paginaDe([
                        crearEstudianteMock({ id: 1, primerNombre: 'Ana', primerApellido: 'Torres' }),
                        crearEstudianteMock({
                            id: 2,
                            primerNombre: 'Carlos',
                            segundoNombre: null,
                            primerApellido: 'Mejia',
                            segundoApellido: null,
                            documento: '1020304051',
                        }),
                    ]),
                ),
            ),
        )

        render(
            <TestWrapper initialEntries={['/admin/estudiantes']}>
                <EstudiantesPage />
            </TestWrapper>,
        )

        expect(await screen.findByText(/Ana Maria Torres/i)).toBeInTheDocument()
        expect(await screen.findByText(/Carlos Mejia/i)).toBeInTheDocument()
    })

    it('muestra el error del servidor y recupera la tabla al reintentar', async () => {
        const user = userEvent.setup()

        server.use(
            gradosHandler,
            http.get('*/estudiantes', () =>
                HttpResponse.json({ mensaje: 'Error interno del servidor' }, { status: 500 }),
            ),
        )

        render(
            <TestWrapper initialEntries={['/admin/estudiantes']}>
                <EstudiantesPage />
            </TestWrapper>,
        )

        expect(
            await screen.findByText('No se pudo cargar el directorio de estudiantes'),
        ).toBeInTheDocument()

        // El servidor "se recupera": este handler reemplaza al de error
        server.use(
            http.get('*/estudiantes', () => HttpResponse.json(paginaDe([crearEstudianteMock()]))),
        )

        await user.click(screen.getByRole('button', { name: /reintentar carga/i }))

        expect(await screen.findByText(/Ana Maria Torres/i)).toBeInTheDocument()
        expect(
            screen.queryByText('No se pudo cargar el directorio de estudiantes'),
        ).not.toBeInTheDocument()
    })

    it('pide al servidor solo los inactivos al elegir "Solo Inactivos"', async () => {
        const user = userEvent.setup()
        const urlsConsultadas: string[] = []

        server.use(
            gradosHandler,
            http.get('*/estudiantes', ({ request }) => {
                urlsConsultadas.push(request.url)
                return HttpResponse.json(paginaDe([crearEstudianteMock()]))
            }),
        )

        render(
            <TestWrapper initialEntries={['/admin/estudiantes']}>
                <EstudiantesPage />
            </TestWrapper>,
        )

        expect(await screen.findByText(/Ana Maria Torres/i)).toBeInTheDocument()

        // Con el filtro en "Todos los estados" el parámetro no viaja: el servidor devuelve ambos
        const primeraConsulta = new URL(urlsConsultadas[0])
        expect(primeraConsulta.searchParams.has('activo')).toBe(false)

        await user.selectOptions(
            screen.getByLabelText('Filtrar por estado del estudiante'),
            'INACTIVOS',
        )

        await waitFor(() => {
            expect(urlsConsultadas.length).toBeGreaterThan(1)
        })

        const ultimaConsulta = new URL(urlsConsultadas[urlsConsultadas.length - 1])
        expect(ultimaConsulta.searchParams.get('activo')).toBe('false')
    })

    it('pide al servidor solo los activos al elegir "Solo Activos"', async () => {
        const user = userEvent.setup()
        const urlsConsultadas: string[] = []

        server.use(
            gradosHandler,
            http.get('*/estudiantes', ({ request }) => {
                urlsConsultadas.push(request.url)
                return HttpResponse.json(paginaDe([crearEstudianteMock()]))
            }),
        )

        render(
            <TestWrapper initialEntries={['/admin/estudiantes']}>
                <EstudiantesPage />
            </TestWrapper>,
        )

        expect(await screen.findByText(/Ana Maria Torres/i)).toBeInTheDocument()

        await user.selectOptions(
            screen.getByLabelText('Filtrar por estado del estudiante'),
            'ACTIVOS',
        )

        await waitFor(() => {
            expect(urlsConsultadas.length).toBeGreaterThan(1)
        })

        const ultimaConsulta = new URL(urlsConsultadas[urlsConsultadas.length - 1])
        expect(ultimaConsulta.searchParams.get('activo')).toBe('true')
    })
})

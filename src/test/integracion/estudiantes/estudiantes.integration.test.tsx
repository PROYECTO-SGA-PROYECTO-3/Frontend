import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
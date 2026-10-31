import { describe, it, expect } from 'vitest'
import { nombreCompleto } from '@/shared/lib/utils'

describe('Función nombreCompleto', () => {
    it('une nombres y apellidos con formato de nombre propio y omite los vacíos', () => {
        const conTodo = nombreCompleto({
            primerNombre: 'LEONEL',
            segundoNombre: 'jose',
            primerApellido: 'enriquez',
            segundoApellido: 'Zambrano',
        })
        const sinSegundos = nombreCompleto({
            primerNombre: 'juan',
            segundoNombre: null,
            primerApellido: 'PEREZ',
            segundoApellido: null,
        })

        expect(conTodo).toBe('Leonel Jose Enriquez Zambrano')
        expect(sinSegundos).toBe('Juan Perez')
    })
})
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

/**
 * Activa y gestiona el ciclo de vida del servidor MSW exclusivamente
 * dentro de las suites de prueba de integración.
 */
export function iniciarServidorMsw() {
  beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}

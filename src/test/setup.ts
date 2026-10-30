import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './server'

// Soporte global para navegación en jsdom
Object.defineProperty(window, 'location', {
  value: {
    assign: vi.fn(),
    pathname: '/',
    search: '',
    href: 'http://localhost:8080/',
    origin: 'http://localhost:8080',
  },
  writable: true,
  configurable: true,
})

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

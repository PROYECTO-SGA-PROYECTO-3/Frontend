import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

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

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Paginacion } from '@/shared/ui/Paginacion'

describe('Navegación entre Páginas de un Listado', () => {
  it('abre la página que el usuario elige en la numeración', async () => {
    const irAPagina = vi.fn()
    const user = userEvent.setup()

    render(<Paginacion paginaActual={0} totalPaginas={3} onCambiarPagina={irAPagina} />)

    await user.click(screen.getByRole('button', { name: '3' }))

    // En pantalla las páginas se numeran desde 1, pero el listado las solicita desde 0
    expect(irAPagina).toHaveBeenCalledWith(2)
  })

  it('bloquea el retroceso en la primera página y el avance en la última', () => {
    const { rerender } = render(
      <Paginacion paginaActual={0} totalPaginas={3} onCambiarPagina={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /página siguiente/i })).toBeEnabled()

    rerender(<Paginacion paginaActual={2} totalPaginas={3} onCambiarPagina={vi.fn()} />)

    expect(screen.getByRole('button', { name: /página anterior/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /página siguiente/i })).toBeDisabled()
  })
})

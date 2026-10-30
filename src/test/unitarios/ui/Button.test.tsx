import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/shared/ui/Button'

describe('Botón de Acción', () => {
  it('comunica su etiqueta claramente y ejecuta la acción al ser pulsado por el usuario', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Guardar</Button>)
    const boton = screen.getByRole('button', { name: /guardar/i })

    expect(boton).toBeInTheDocument()
    await user.click(boton)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('bloquea la interacción mientras se procesa una petición o cuando la acción no está permitida', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <Button disabled onClick={handleClick}>
        Acción
      </Button>,
    )
    const boton = screen.getByRole('button', { name: /acción/i })
    expect(boton).toBeDisabled()
    await user.click(boton)

    rerender(
      <Button isLoading onClick={handleClick}>
        Acción
      </Button>,
    )
    expect(boton).toBeDisabled()
    await user.click(boton)

    expect(handleClick).not.toHaveBeenCalled()
  })
})

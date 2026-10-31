import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorState } from '@/shared/ui'

describe('Componente ErrorState', () => {
    it('muestra el título y el mensaje, y permite reintentar la carga', async () => {
        const onRetry = vi.fn()
        const user = userEvent.setup()

        render(
            <ErrorState titulo="No se pudo cargar" mensaje="El servidor no responde" onRetry={onRetry} />,
        )

        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText('No se pudo cargar')).toBeInTheDocument()
        expect(screen.getByText('El servidor no responde')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /reintentar carga/i }))
        expect(onRetry).toHaveBeenCalledTimes(1)
    })
})
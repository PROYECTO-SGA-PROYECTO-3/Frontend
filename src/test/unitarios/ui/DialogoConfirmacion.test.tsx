import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogoConfirmacion } from '@/shared/ui'

describe('Componente DialogoConfirmacion', () => {
    it('ejecuta la acción solo al confirmar y no la ejecuta al cancelar', async () => {
        const onConfirmar = vi.fn()
        const onCancelar = vi.fn()
        const user = userEvent.setup()

        render(
            <DialogoConfirmacion
                abierto
                titulo="Eliminar estudiante"
                mensaje="Esta acción es irreversible"
                onConfirmar={onConfirmar}
                onCancelar={onCancelar}
            />,
        )

        await user.click(screen.getByRole('button', { name: /cancelar/i }))
        expect(onCancelar).toHaveBeenCalledTimes(1)
        expect(onConfirmar).not.toHaveBeenCalled()

        await user.click(screen.getByRole('button', { name: /confirmar/i }))
        expect(onConfirmar).toHaveBeenCalledTimes(1)
    })
})
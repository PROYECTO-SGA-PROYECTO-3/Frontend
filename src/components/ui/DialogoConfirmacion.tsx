import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface DialogoConfirmacionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  error?: string
  procesando?: boolean
  textoConfirmar?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  error,
  procesando = false,
  textoConfirmar = 'Confirmar',
  onConfirmar,
  onCancelar,
}: DialogoConfirmacionProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{mensaje}</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <div className="w-auto">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelar}
              disabled={procesando}
            >
              Cancelar
            </Button>
          </div>
          <div className="w-auto">
            <Button
              type="button"
              variant="peligro"
              isLoading={procesando}
              onClick={onConfirmar}
            >
              {textoConfirmar}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { BookMarked, X, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import type { Asignatura } from '../types'

interface MateriaModalProps {
  abierto: boolean
  materiaAEditar?: Asignatura | null
  guardando: boolean
  errorServidor?: string | null
  existeDuplicado: (nombre: string, ignorarId?: number) => boolean
  onGuardar: (nombre: string) => Promise<void>
  onCerrar: () => void
}

const MAX_CARACTERES = 80

export function MateriaModal({
  abierto,
  materiaAEditar,
  guardando,
  errorServidor,
  existeDuplicado,
  onGuardar,
  onCerrar,
}: MateriaModalProps) {
  const [nombre, setNombre] = useState(materiaAEditar?.nombre ?? '')
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const esEdicion = Boolean(materiaAEditar)

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto && !guardando) {
        onCerrar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [abierto, guardando, onCerrar])

  if (!abierto) return null

  const longitud = nombre.trim().length
  const esDuplicado = existeDuplicado(nombre, materiaAEditar?.id)

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault()
    const nombreLimpio = nombre.trim()

    if (!nombreLimpio) {
      setErrorLocal('El nombre de la materia es obligatorio.')
      return
    }

    if (nombreLimpio.length < 3) {
      setErrorLocal('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (esDuplicado) {
      setErrorLocal('Ya existe una materia registrada con este nombre.')
      return
    }

    setErrorLocal(null)
    await onGuardar(nombreLimpio)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-materia-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <BookMarked size={20} />
            </div>
            <div>
              <h2 id="modal-materia-titulo" className="text-lg font-bold text-slate-900">
                {esEdicion ? 'Editar Asignatura' : 'Nueva Asignatura'}
              </h2>
              <p className="text-xs text-slate-500">
                {esEdicion
                  ? 'Modifica el nombre oficial de la asignatura en el catálogo'
                  : 'Ingresa los datos para registrar la asignatura en el catálogo'}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={onCerrar}
            disabled={guardando}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio} className="mt-5 space-y-4">
          <div>
            <Input
              id="nombre-materia-input"
              label="Nombre de la Asignatura"
              placeholder="Ej. Ciencias Naturales y Educación Ambiental"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                if (errorLocal) setErrorLocal(null)
              }}
              maxLength={MAX_CARACTERES}
              autoFocus
              disabled={guardando}
              error={errorLocal ?? undefined}
            />

            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>Mínimo 3 caracteres</span>
              <span>
                {longitud}/{MAX_CARACTERES}
              </span>
            </div>
          </div>

          {/* Advertencia de duplicado */}
          {esDuplicado && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <AlertCircle size={14} className="shrink-0" />
              <span>Ya existe una materia registrada con este nombre en el sistema.</span>
            </div>
          )}

          {/* Error del servidor */}
          {errorServidor && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {errorServidor}
            </div>
          )}

          {/* Acciones */}
          <div className="mt-6 flex justify-end gap-3 pt-2">
            <div className="w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={onCerrar}
                disabled={guardando}
              >
                Cancelar
              </Button>
            </div>
            <div className="w-auto">
              <Button
                type="submit"
                variant="primary"
                isLoading={guardando}
                disabled={!nombre.trim() || esDuplicado}
              >
                {esEdicion ? 'Guardar Cambios' : 'Registrar Asignatura'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

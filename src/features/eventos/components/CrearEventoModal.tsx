import { useState, useEffect, type FormEvent } from 'react'
import { X, Calendar } from 'lucide-react'
import { Button, Input } from '@/shared/ui'
import type { SolicitudCrearEvento } from '../types'

export interface CrearEventoModalProps {
  abierto: boolean
  onCerrar: () => void
  onCrear: (datos: SolicitudCrearEvento) => Promise<void>
  estaCreando: boolean
}

export function CrearEventoModal({
  abierto,
  onCerrar,
  onCrear,
  estaCreando,
}: CrearEventoModalProps) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)

  // Reset al abrir/cerrar
  useEffect(() => {
    if (abierto) {
      setTitulo('')
      setDescripcion('')
      setFecha('')
      setLugar('')
      setErrorValidacion(null)
      setErrorServidor(null)
    }
  }, [abierto])

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto && !estaCreando) {
        onCerrar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [abierto, estaCreando, onCerrar])

  if (!abierto) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorValidacion(null)
    setErrorServidor(null)

    const tit = titulo.trim()
    const desc = descripcion.trim()
    const fec = fecha.trim()
    const lug = lugar.trim() || null

    if (!tit) {
      setErrorValidacion('El título del evento es obligatorio.')
      return
    }

    if (!desc) {
      setErrorValidacion('La descripción del evento es obligatoria.')
      return
    }

    if (!fec) {
      setErrorValidacion('La fecha del evento es obligatoria.')
      return
    }

    try {
      await onCrear({
        titulo: tit,
        descripcion: desc,
        fecha: fec,
        lugar: lug,
      })
      onCerrar()
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'No se pudo crear el evento.'
      setErrorServidor(mensaje)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-evento"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all">
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-600/10">
              <Calendar size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 id="titulo-modal-evento" className="text-lg font-bold text-slate-900 leading-snug">
                Crear Evento Institucional
              </h2>
              <p className="text-xs text-slate-500">
                Programa una actividad oficial en el calendario del colegio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            disabled={estaCreando}
            aria-label="Cerrar modal"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <Input
            label="Título del evento *"
            placeholder="Ej. Entrega de Informes Académicos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={150}
            disabled={estaCreando}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="descripcion-evento" className="text-sm font-medium text-slate-700">
              Descripción *
            </label>
            <textarea
              id="descripcion-evento"
              placeholder="Ej. Segundo Periodo Académico. Asistencia obligatoria de acudientes."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={255}
              rows={3}
              disabled={estaCreando}
              required
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 resize-none"
            />
            <span className="text-right text-[11px] text-slate-400">
              {descripcion.length}/255 caracteres
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Fecha *"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              disabled={estaCreando}
              required
            />
            <Input
              label="Lugar (opcional)"
              placeholder="Ej. Auditorio Principal"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              maxLength={150}
              disabled={estaCreando}
            />
          </div>

          {/* Errores */}
          {errorValidacion && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-800">
              {errorValidacion}
            </div>
          )}

          {errorServidor && (
            <div className="rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-700">
              {errorServidor}
            </div>
          )}

          {/* Acciones */}
          <div className="mt-3 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCerrar}
              disabled={estaCreando}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={estaCreando}>
              Crear Evento
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

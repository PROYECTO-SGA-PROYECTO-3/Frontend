import { useState, type ChangeEvent, type DragEvent } from 'react'
import { CheckCircle2, FileSignature, Image as ImageIcon, Upload, X } from 'lucide-react'
import { Button } from '@/shared/ui'
import { urlBackend } from '@/shared/lib/utils'
import { useDocenteMutations } from '../hooks'
import type { Docente } from '../types'

interface DocenteFirmaUploaderProps {
  docenteId: number
  firmaActualUrl: string | null
  onFirmaActualizada?: (docente: Docente) => void
}

export function DocenteFirmaUploader({
  docenteId,
  firmaActualUrl,
  onFirmaActualizada,
}: DocenteFirmaUploaderProps) {
  const [archivoFirma, setArchivoFirma] = useState<File | null>(null)
  const [previewLocal, setPreviewLocal] = useState<string | null>(null)
  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const [imagenFallo, setImagenFallo] = useState(false)
  const [estaArrastrando, setEstaArrastrando] = useState(false)

  const { actualizarFirma, estaSubiendoFirma, errorFirma } = useDocenteMutations()

  const validarYAsignarArchivo = (archivo: File) => {
    setErrorLocal(null)
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(archivo.type)) {
      setErrorLocal('Solo se admiten archivos de imagen en formato PNG, JPEG o WEBP.')
      return
    }
    if (archivo.size > 2 * 1024 * 1024) {
      setErrorLocal('El tamaño máximo permitido para la firma es de 2 MB.')
      return
    }

    setArchivoFirma(archivo)
    setPreviewLocal(URL.createObjectURL(archivo))
    setImagenFallo(false)
  }

  const manejarCambioInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validarYAsignarArchivo(file)
    }
  }

  const manejarDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setEstaArrastrando(true)
  }

  const manejarDragLeave = () => {
    setEstaArrastrando(false)
  }

  const manejarDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setEstaArrastrando(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      validarYAsignarArchivo(file)
    }
  }

  const cancelarSeleccion = () => {
    setArchivoFirma(null)
    setPreviewLocal(null)
    setErrorLocal(null)
  }

  const guardarFirma = async () => {
    if (!archivoFirma) return
    setErrorLocal(null)
    try {
      const docenteActualizado = await actualizarFirma({
        id: docenteId,
        archivo: archivoFirma,
      })
      setArchivoFirma(null)
      setPreviewLocal(null)
      if (onFirmaActualizada) {
        onFirmaActualizada(docenteActualizado)
      }
    } catch {
      // Error manejado por errorFirma
    }
  }

  const tieneFirmaGuardada = Boolean(firmaActualUrl) && !imagenFallo

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <FileSignature size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            Firma Digital del Docente
          </h3>
          <p className="text-xs text-slate-500">
            Utilizada para la firma automática en boletines, reportes y certificados oficiales.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Zona de previsualización */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Vista Previa Actual
          </span>
          <div className="relative flex h-36 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition">
            {previewLocal ? (
              <img
                src={previewLocal}
                alt="Vista previa de nueva firma"
                className="max-h-full max-w-full object-contain"
              />
            ) : tieneFirmaGuardada ? (
              <img
                src={urlBackend(firmaActualUrl as string)}
                alt="Firma actual registrada"
                className="max-h-full max-w-full object-contain"
                onError={() => setImagenFallo(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center text-xs text-slate-400">
                <ImageIcon size={28} className="text-slate-300" />
                <span>Sin firma digital registrada</span>
              </div>
            )}

            {previewLocal && (
              <span className="absolute top-2 right-2 rounded-md bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                Archivo nuevo
              </span>
            )}

            {!previewLocal && tieneFirmaGuardada && (
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                <CheckCircle2 size={12} />
                Guardada
              </span>
            )}
          </div>
        </div>

        {/* Zona de carga y dropzone */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Actualizar Firma
          </span>

          <div
            onDragOver={manejarDragOver}
            onDragLeave={manejarDragLeave}
            onDrop={manejarDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${
              estaArrastrando
                ? 'border-brand-500 bg-brand-50/50'
                : 'border-slate-300 hover:border-brand-400 bg-slate-50/30'
            }`}
          >
            <Upload size={22} className="text-slate-400" />
            <p className="mt-2 text-xs font-semibold text-slate-700">
              Arrastra una imagen aquí o explora tus archivos
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Formatos recomendados: PNG con fondo transparente (máx. 2MB)
            </p>

            <label className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition">
              Examinar archivo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={manejarCambioInput}
                className="hidden"
              />
            </label>
          </div>

          {/* Botones de acción cuando hay archivo seleccionado */}
          {archivoFirma && (
            <div className="mt-2 flex items-center justify-end gap-2 animate-in fade-in duration-200">
              <Button type="button" variant="secondary" onClick={cancelarSeleccion}>
                <X size={14} />
                Descartar
              </Button>
              <Button
                type="button"
                isLoading={estaSubiendoFirma}
                onClick={guardarFirma}
              >
                Subir firma digital
              </Button>
            </div>
          )}
        </div>
      </div>

      {(errorLocal || errorFirma) && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {errorLocal || errorFirma}
        </div>
      )}
    </div>
  )
}

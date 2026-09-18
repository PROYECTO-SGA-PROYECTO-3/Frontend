import type { ChangeEvent } from 'react'
import { Upload, Image as ImageIcon, Check, Loader2 } from 'lucide-react'
import type { ItemMediaInfo } from '../hooks/useInstitucionMedia'

interface MediaUploadItemProps {
  item: ItemMediaInfo
  estaSubiendo: boolean
  onSeleccionarArchivo: (e: ChangeEvent<HTMLInputElement>) => void
}

export function MediaUploadItem({
  item,
  estaSubiendo,
  onSeleccionarArchivo,
}: MediaUploadItemProps) {
  const tieneArchivo = Boolean(item.urlActual)

  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-inner">
          {item.urlActual ? (
            <img
              src={item.urlActual}
              alt={item.titulo}
              className="h-full w-full object-contain p-1 transition-transform hover:scale-110"
            />
          ) : (
            <ImageIcon className="text-slate-300" size={24} />
          )}
          {tieneArchivo && (
            <div className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-600 text-white shadow-xs">
              <Check size={9} strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{item.titulo}</p>
          <p className="truncate text-xs text-slate-500">{item.descripcion}</p>
        </div>
      </div>

      <div className="shrink-0">
        <label className="group relative inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-brand-600 hover:bg-brand-50 hover:text-brand-700">
          {estaSubiendo ? (
            <>
              <Loader2 size={14} className="animate-spin text-brand-600" />
              <span>Subiendo...</span>
            </>
          ) : (
            <>
              <Upload size={14} className="transition-transform group-hover:-translate-y-0.5" />
              <span>{tieneArchivo ? 'Reemplazar' : 'Subir'}</span>
            </>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            disabled={estaSubiendo}
            onChange={onSeleccionarArchivo}
          />
        </label>
      </div>
    </div>
  )
}

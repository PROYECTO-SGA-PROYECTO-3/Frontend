import { AlertCircle } from 'lucide-react'
import type { Institucion } from '@/types/institucion.types'
import { useInstitucionMedia } from '@/hooks/admin/configuracion/useInstitucionMedia'
import { MediaUploadItem } from './MediaUploadItem'

interface InstitucionMediaUploaderProps {
  institucion: Institucion | null
}

export function InstitucionMediaUploader({ institucion }: InstitucionMediaUploaderProps) {
  const {
    itemsMedia,
    tipoEnProceso,
    errorGlobal,
    isPending,
    manejarSubidaArchivo,
  } = useInstitucionMedia(institucion)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Imágenes y Firmas</h3>
        <p className="mt-1 text-xs text-slate-500">
          Formatos compatibles: PNG, JPG o WEBP (máx. 3 MB).
        </p>
      </div>

      {errorGlobal && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-500 mt-0.5" />
          <span>{errorGlobal}</span>
        </div>
      )}

      <div className="flex flex-col divide-y divide-slate-100">
        {itemsMedia.map((item) => (
          <MediaUploadItem
            key={item.tipo}
            item={item}
            estaSubiendo={tipoEnProceso === item.tipo && isPending}
            onSeleccionarArchivo={(e) => manejarSubidaArchivo(e, item.tipo)}
          />
        ))}
      </div>
    </div>
  )
}

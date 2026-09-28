import { FileSpreadsheet, UploadCloud } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface SubirPlanillaProps {
  archivo: File | null
  onCambiarArchivo: (archivo: File | null) => void
  onPrevisualizar: () => void
  puedeSubir: boolean
  previsualizando: boolean
}

export function SubirPlanilla({
  archivo,
  onCambiarArchivo,
  onPrevisualizar,
  puedeSubir,
  previsualizando,
}: SubirPlanillaProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <UploadCloud size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">2. Subir planilla diligenciada</h2>
          <p className="text-sm text-slate-500">Sube el archivo .xlsx con las notas registradas para procesarlo.</p>
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center transition-all hover:border-brand-400 hover:bg-brand-50/30">
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(evento) => onCambiarArchivo(evento.target.files?.[0] ?? null)}
        />
        {archivo ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 shadow-2xs">
              <FileSpreadsheet size={26} />
            </div>
            <span className="text-sm font-semibold text-slate-900">{archivo.name}</span>
            <span className="text-xs text-slate-400">Haz clic si deseas elegir otro archivo</span>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-2xs">
              <UploadCloud size={26} />
            </div>
            <span className="text-sm font-medium text-slate-700">
              Haz clic para seleccionar el archivo Excel (.xlsx)
            </span>
            <span className="text-xs text-slate-400">Solo archivos con formato compatible .xlsx</span>
          </>
        )}
      </label>

      <div className="mt-5 w-fit">
        <Button
          type="button"
          onClick={onPrevisualizar}
          disabled={!puedeSubir}
          isLoading={previsualizando}
        >
          <UploadCloud size={16} />
          Previsualizar Planilla
        </Button>
      </div>
    </section>
  )
}

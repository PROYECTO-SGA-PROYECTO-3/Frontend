import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CrearAnioLectivoFormProps {
  anioNuevo: string
  activarAlCrear: boolean
  creando: boolean
  errorCrear: string | null
  onAnioNuevoChange: (valor: string) => void
  onActivarAlCrearChange: (activar: boolean) => void
  onSubmit: (e: FormEvent) => void
}

export function CrearAnioLectivoForm({
  anioNuevo,
  activarAlCrear,
  creando,
  errorCrear,
  onAnioNuevoChange,
  onActivarAlCrearChange,
  onSubmit,
}: CrearAnioLectivoFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <Input
          type="number"
          placeholder="Ej. 2027"
          value={anioNuevo}
          onChange={(e) => onAnioNuevoChange(e.target.value)}
          error={errorCrear ?? undefined}
        />
        <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 select-none">
          <input
            type="checkbox"
            checked={activarAlCrear}
            onChange={(e) => onActivarAlCrearChange(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600 cursor-pointer"
          />
          <span>Activar este año inmediatamente tras su creación</span>
        </label>
      </div>

      <div className="shrink-0">
        <Button type="submit" isLoading={creando}>
          <Plus size={18} />
          Crear Año Lectivo
        </Button>
      </div>
    </form>
  )
}

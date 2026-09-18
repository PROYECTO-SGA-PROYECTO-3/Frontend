import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import type { FormPeriodoValores } from '../hooks/useGestionPeriodos'
import type { Periodo } from '../types'

interface PeriodoFormProps {
  periodoEditando: Periodo | 'nuevo'
  form: FormPeriodoValores
  errorForm: string | null
  guardando: boolean
  onFormChange: (valores: Partial<FormPeriodoValores>) => void
  onCancelar: () => void
  onSubmit: (e: FormEvent) => void
}

export function PeriodoForm({
  periodoEditando,
  form,
  errorForm,
  guardando,
  onFormChange,
  onCancelar,
  onSubmit,
}: PeriodoFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
      <h4 className="text-sm font-semibold text-slate-800">
        {periodoEditando === 'nuevo' ? 'Crear Nuevo Periodo' : 'Editar Periodo'}
      </h4>

      <Input
        label="Nombre del Periodo *"
        placeholder="Ej. Primer Periodo"
        value={form.nombre}
        onChange={(e) => onFormChange({ nombre: e.target.value })}
      />

      <Input
        label="Ponderación / Porcentaje (%) *"
        type="number"
        step="0.1"
        min="0.1"
        max="100"
        placeholder="Ej. 25"
        value={form.porcentaje}
        onChange={(e) => onFormChange({ porcentaje: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Fecha de Inicio *"
          type="date"
          value={form.fechaInicio}
          onChange={(e) => onFormChange({ fechaInicio: e.target.value })}
        />
        <Input
          label="Fecha de Cierre *"
          type="date"
          value={form.fechaFin}
          onChange={(e) => onFormChange({ fechaFin: e.target.value })}
        />
      </div>

      {errorForm && (
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-3 text-xs text-red-700">
          {errorForm}
        </div>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <div className="w-auto">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </Button>
        </div>
        <div className="w-auto">
          <Button type="submit" isLoading={guardando}>
            {periodoEditando === 'nuevo' ? 'Crear Periodo' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </form>
  )
}

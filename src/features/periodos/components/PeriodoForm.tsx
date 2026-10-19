import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import type { Periodo, SolicitudPeriodo } from '../types'

export const esquemaPeriodo = z
  .object({
    nombre: z.string().trim().min(1, 'El nombre del periodo es requerido.'),
    porcentaje: z.coerce
      .number({ message: 'El porcentaje debe ser un valor numérico.' })
      .min(0.1, 'El porcentaje debe ser mayor a 0.')
      .max(100, 'El porcentaje no puede superar el 100%.'),
    fechaInicio: z.string().min(1, 'La fecha de inicio es requerida.'),
    fechaFin: z.string().min(1, 'La fecha de fin es requerida.'),
  })
  .refine(
    (datos) => !datos.fechaInicio || !datos.fechaFin || datos.fechaInicio <= datos.fechaFin,
    {
      message: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
      path: ['fechaFin'],
    }
  )

export type PeriodoFormValores = z.input<typeof esquemaPeriodo>

interface PeriodoFormProps {
  periodoEditando: Periodo | 'nuevo'
  guardando: boolean
  errorServidor?: string | null
  onCancelar: () => void
  onSubmit: (datos: Omit<SolicitudPeriodo, 'anioLectivoId'>) => void
}

export function PeriodoForm({
  periodoEditando,
  guardando,
  errorServidor,
  onCancelar,
  onSubmit,
}: PeriodoFormProps) {
  const esNuevo = periodoEditando === 'nuevo'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PeriodoFormValores>({
    resolver: zodResolver(esquemaPeriodo),
    values: !esNuevo
      ? {
          nombre: periodoEditando.nombre,
          porcentaje: periodoEditando.porcentaje,
          fechaInicio: periodoEditando.fechaInicio,
          fechaFin: periodoEditando.fechaFin,
        }
      : undefined,
    defaultValues: {
      nombre: '',
      porcentaje: 25,
      fechaInicio: '',
      fechaFin: '',
    },
  })

  const handleEnviarFormulario = handleSubmit((valores) => {
    onSubmit({
      nombre: valores.nombre.trim(),
      porcentaje: Number(valores.porcentaje),
      fechaInicio: valores.fechaInicio,
      fechaFin: valores.fechaFin,
    })
  })

  return (
    <form onSubmit={handleEnviarFormulario} className="mt-5 flex flex-col gap-4">
      <h4 className="text-sm font-semibold text-slate-800">
        {esNuevo ? 'Crear Nuevo Periodo' : 'Editar Periodo'}
      </h4>

      {errorServidor && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-700">
          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
          <span>{errorServidor}</span>
        </div>
      )}

      <Input
        label="Nombre del Periodo *"
        placeholder="Ej. Primer Periodo"
        autoFocus
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <Input
        label="Ponderación / Porcentaje (%) *"
        type="number"
        step="0.1"
        min="0.1"
        max="100"
        placeholder="Ej. 25"
        error={errors.porcentaje?.message}
        {...register('porcentaje')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Fecha de Inicio *"
          type="date"
          error={errors.fechaInicio?.message}
          {...register('fechaInicio')}
        />
        <Input
          label="Fecha de Cierre *"
          type="date"
          error={errors.fechaFin?.message}
          {...register('fechaFin')}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancelar}
          disabled={guardando}
          className="w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={guardando}
          className="w-auto"
        >
          {esNuevo ? 'Crear Periodo' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}

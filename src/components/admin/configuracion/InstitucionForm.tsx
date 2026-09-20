import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Institucion } from '@/types/institucion.types'
import { useInstitucionForm } from '@/hooks/admin/configuracion/useInstitucionForm'

interface InstitucionFormProps {
  institucion: Institucion | null
}

export function InstitucionForm({ institucion }: InstitucionFormProps) {
  const {
    register,
    errors,
    isDirty,
    isPending,
    isSuccess,
    isError,
    errorMessage,
    onSubmit,
  } = useInstitucionForm(institucion)

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">Información Oficial y Legal</h3>
        <p className="mt-1 text-xs text-slate-500">
          Estos datos se imprimirán en certificados, constancias, membretes y boletines académicos.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nombre de la Institución *"
          placeholder="Ej. Institución Educativa Agrícola Fray Isidoro"
          error={errors.nombre?.message}
          {...register('nombre')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="NIT *"
            placeholder="Ej. 800.123.456-7"
            error={errors.nit?.message}
            {...register('nit')}
          />
          <Input
            label="Código DANE"
            placeholder="Ej. 123456789012"
            error={errors.codigoDane?.message}
            {...register('codigoDane')}
          />
        </div>

        <Input
          label="Resolución de Aprobación"
          placeholder="Ej. Resolución No. 1234 del 15 de Noviembre de 2010"
          error={errors.resolucion?.message}
          {...register('resolucion')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Dirección"
            placeholder="Ej. Vereda Montclar, Km 4"
            error={errors.direccion?.message}
            {...register('direccion')}
          />
          <Input
            label="Nombre del Rector(a)"
            placeholder="Ej. Lic. Carlos Mario Pérez"
            error={errors.nombreRector?.message}
            {...register('nombreRector')}
          />
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/70 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50/70 p-3 text-sm text-brand-800">
          <CheckCircle2 size={18} className="shrink-0 text-brand-600" />
          <span>Información institucional guardada exitosamente.</span>
        </div>
      )}

      <div className="mt-2 flex justify-end">
        <div className="w-full sm:w-auto">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending || (!isDirty && !isError)}
          >
            <Save size={18} />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </form>
  )
}

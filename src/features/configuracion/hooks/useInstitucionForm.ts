import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { actualizarInstitucion } from '../api/institucionApi'
import { extraerMensajeError } from '@/shared/lib'
import type { Institucion, SolicitudActualizarInstitucion } from '../types'

export const esquemaInstitucion = z.object({
  nombre: z.string().trim().min(1, 'El nombre de la institución es obligatorio'),
  nit: z.string().trim().min(1, 'El NIT es obligatorio'),
  codigoDane: z.string().default(''),
  resolucion: z.string().default(''),
  direccion: z.string().default(''),
  nombreRector: z.string().default(''),
})

export type FormValoresInstitucion = z.input<typeof esquemaInstitucion>

export function useInstitucionForm(
  institucion: Institucion | null,
  onGuardadoExitoso?: () => void,
) {
  const queryClient = useQueryClient()

  // Sincronización reactiva declarativa mediante values (estándar React Hook Form v7)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValoresInstitucion>({
    resolver: zodResolver(esquemaInstitucion),
    values: institucion
      ? {
          nombre: institucion.nombre || '',
          nit: institucion.nit || '',
          codigoDane: institucion.codigoDane || '',
          resolucion: institucion.resolucion || '',
          direccion: institucion.direccion || '',
          nombreRector: institucion.nombreRector || '',
        }
      : undefined,
    defaultValues: {
      nombre: '',
      nit: '',
      codigoDane: '',
      resolucion: '',
      direccion: '',
      nombreRector: '',
    },
  })

  const mutacionGuardar = useMutation({
    mutationFn: (datos: SolicitudActualizarInstitucion) => actualizarInstitucion(datos),
    onSuccess: (dataActualizada) => {
      queryClient.setQueryData(['institucion'], dataActualizada)
      queryClient.invalidateQueries({ queryKey: ['institucion'] })
      onGuardadoExitoso?.()
    },
  })

  const onSubmit = handleSubmit((datos: FormValoresInstitucion) => {
    mutacionGuardar.mutate({
      nombre: datos.nombre,
      nit: datos.nit,
      codigoDane: datos.codigoDane || '',
      resolucion: datos.resolucion || '',
      direccion: datos.direccion || '',
      nombreRector: datos.nombreRector || '',
    })
  })

  return {
    register,
    errors,
    isDirty,
    reset,
    isPending: mutacionGuardar.isPending,
    isSuccess: mutacionGuardar.isSuccess,
    isError: mutacionGuardar.isError,
    errorMessage: mutacionGuardar.error ? extraerMensajeError(mutacionGuardar.error) : null,
    onSubmit,
  }
}

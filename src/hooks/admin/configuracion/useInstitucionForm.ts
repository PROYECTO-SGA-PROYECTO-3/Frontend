import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { actualizarInstitucion } from '@/api/institucion.api'
import { extraerMensajeError } from '@/api/axios'
import type { Institucion, SolicitudActualizarInstitucion } from '@/types/institucion.types'

export const esquemaInstitucion = z.object({
  nombre: z.string().trim().min(1, 'El nombre de la institución es obligatorio'),
  nit: z.string().trim().min(1, 'El NIT es obligatorio'),
  codigoDane: z.string().default(''),
  resolucion: z.string().default(''),
  direccion: z.string().default(''),
  nombreRector: z.string().default(''),
})

export type FormValoresInstitucion = z.input<typeof esquemaInstitucion>

export function useInstitucionForm(institucion: Institucion | null) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValoresInstitucion>({
    resolver: zodResolver(esquemaInstitucion),
    defaultValues: {
      nombre: institucion?.nombre ?? '',
      nit: institucion?.nit ?? '',
      codigoDane: institucion?.codigoDane ?? '',
      resolucion: institucion?.resolucion ?? '',
      direccion: institucion?.direccion ?? '',
      nombreRector: institucion?.nombreRector ?? '',
    },
  })

  useEffect(() => {
    if (institucion) {
      reset({
        nombre: institucion.nombre || '',
        nit: institucion.nit || '',
        codigoDane: institucion.codigoDane || '',
        resolucion: institucion.resolucion || '',
        direccion: institucion.direccion || '',
        nombreRector: institucion.nombreRector || '',
      })
    }
  }, [institucion, reset])

  const mutacionGuardar = useMutation({
    mutationFn: (datos: SolicitudActualizarInstitucion) => actualizarInstitucion(datos),
    onSuccess: (dataActualizada) => {
      queryClient.setQueryData(['institucion'], dataActualizada)
      queryClient.invalidateQueries({ queryKey: ['institucion'] })
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
    isPending: mutacionGuardar.isPending,
    isSuccess: mutacionGuardar.isSuccess,
    isError: mutacionGuardar.isError,
    errorMessage: mutacionGuardar.error ? extraerMensajeError(mutacionGuardar.error) : null,
    onSubmit,
  }
}

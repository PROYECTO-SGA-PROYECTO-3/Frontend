import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listarPeriodos,
  crearPeriodo,
  actualizarPeriodo,
  cerrarPeriodo,
  reabrirPeriodo,
} from '@/api/periodos.api'
import { extraerMensajeError } from '@/api/axios'
import type { AnioLectivo } from '@/types/anioLectivo.types'
import type { Periodo } from '@/types/periodo.types'

export interface FormPeriodoValores {
  nombre: string
  porcentaje: string
  fechaInicio: string
  fechaFin: string
}

const FORM_INICIAL: FormPeriodoValores = {
  nombre: '',
  porcentaje: '',
  fechaInicio: '',
  fechaFin: '',
}

export function useGestionPeriodos(anio: AnioLectivo) {
  const queryClient = useQueryClient()
  const [periodoEditando, setPeriodoEditando] = useState<Periodo | 'nuevo' | null>(null)
  const [form, setForm] = useState<FormPeriodoValores>(FORM_INICIAL)
  const [errorForm, setErrorForm] = useState<string | null>(null)

  // Consultar periodos del año
  const {
    data: periodos = [],
    isLoading,
    error: errorCarga,
  } = useQuery({
    queryKey: ['periodos', anio.id],
    queryFn: () => listarPeriodos(anio.id),
  })

  // Mutación para crear / actualizar periodo
  const mutacionGuardar = useMutation({
    mutationFn: async () => {
      const porcentajeNumerico = Number(form.porcentaje)
      const datos = {
        nombre: form.nombre.trim(),
        porcentaje: porcentajeNumerico,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        anioLectivoId: anio.id,
      }

      if (periodoEditando === 'nuevo') {
        return await crearPeriodo(datos)
      } else if (periodoEditando) {
        return await actualizarPeriodo(periodoEditando.id, datos)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos', anio.id] })
      setPeriodoEditando(null)
      setForm(FORM_INICIAL)
      setErrorForm(null)
    },
    onError: (err) => {
      setErrorForm(extraerMensajeError(err))
    },
  })

  // Mutación para alternar cierre / reapertura del periodo
  const mutacionAlternarEstado = useMutation({
    mutationFn: async (periodo: Periodo) => {
      if (periodo.cerradoParaDocentes) {
        return await reabrirPeriodo(periodo.id)
      } else {
        return await cerrarPeriodo(periodo.id)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos', anio.id] })
    },
  })

  const iniciarCrear = () => {
    setForm(FORM_INICIAL)
    setErrorForm(null)
    setPeriodoEditando('nuevo')
  }

  const iniciarEditar = (periodo: Periodo) => {
    setForm({
      nombre: periodo.nombre,
      porcentaje: String(periodo.porcentaje),
      fechaInicio: periodo.fechaInicio,
      fechaFin: periodo.fechaFin,
    })
    setErrorForm(null)
    setPeriodoEditando(periodo)
  }

  const cancelarEdicion = () => {
    setPeriodoEditando(null)
    setForm(FORM_INICIAL)
    setErrorForm(null)
  }

  const alEnviarForm = (e: FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setErrorForm('El nombre del periodo es requerido.')
      return
    }
    const pct = Number(form.porcentaje)
    if (!pct || pct <= 0 || pct > 100) {
      setErrorForm('El porcentaje debe situarse entre 0.1 y 100%.')
      return
    }
    if (!form.fechaInicio || !form.fechaFin) {
      setErrorForm('Las fechas de inicio y fin son obligatorias.')
      return
    }
    if (form.fechaInicio > form.fechaFin) {
      setErrorForm('La fecha de inicio no puede ser posterior a la fecha de fin.')
      return
    }

    setErrorForm(null)
    mutacionGuardar.mutate()
  }

  return {
    periodos,
    isLoading,
    errorCarga: errorCarga ? extraerMensajeError(errorCarga) : null,
    periodoEditando,
    form,
    setForm,
    errorForm,
    guardando: mutacionGuardar.isPending,
    alternandoEstado: mutacionAlternarEstado.isPending,
    iniciarCrear,
    iniciarEditar,
    cancelarEdicion,
    alEnviarForm,
    alternarEstado: (p: Periodo) => mutacionAlternarEstado.mutate(p),
  }
}

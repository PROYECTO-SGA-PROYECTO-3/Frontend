import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearAnioLectivo, activarAnioLectivo, eliminarAnioLectivo } from '../api/aniosLectivosApi'
import { extraerMensajeError } from '@/shared/lib'
import { useAnioLectivoStore } from '../store'
import type { AnioLectivo } from '../types'

interface UseAniosLectivosMutationsProps {
  onExitoCrear?: (creado: AnioLectivo) => void
  onExitoActivar?: (id: number) => void
  onExitoEliminar?: (id: number) => void
}

export function useAniosLectivosMutations(props?: UseAniosLectivosMutationsProps) {
  const queryClient = useQueryClient()
  const cargarAniosStore = useAnioLectivoStore((estado) => estado.cargarAnios)
  const seleccionarAnioStore = useAnioLectivoStore((estado) => estado.seleccionarAnio)

  const [errorCrear, setErrorCrear] = useState<string | null>(null)
  const [errorActivar, setErrorActivar] = useState<string | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const mutacionCrear = useMutation({
    mutationFn: async ({ anio, activar }: { anio: number; activar: boolean }) => {
      const creado = await crearAnioLectivo({ anio, activo: false })
      if (activar) {
        await activarAnioLectivo(creado.id)
        seleccionarAnioStore(creado.id)
      }
      return creado
    },
    onSuccess: async (creado) => {
      await queryClient.invalidateQueries({ queryKey: ['aniosLectivos'] })
      await cargarAniosStore()
      setErrorCrear(null)
      props?.onExitoCrear?.(creado)
    },
    onError: (err) => {
      setErrorCrear(extraerMensajeError(err))
    },
  })

  const mutacionActivar = useMutation({
    mutationFn: async (id: number) => {
      return await activarAnioLectivo(id)
    },
    onSuccess: async (_, id) => {
      seleccionarAnioStore(id)
      await queryClient.invalidateQueries({ queryKey: ['aniosLectivos'] })
      await cargarAniosStore()
      setErrorActivar(null)
      props?.onExitoActivar?.(id)
    },
    onError: (err) => {
      setErrorActivar(extraerMensajeError(err))
    },
  })

  const mutacionEliminar = useMutation({
    mutationFn: async (id: number) => {
      return await eliminarAnioLectivo(id)
    },
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['aniosLectivos'] })
      await cargarAniosStore()
      setErrorEliminar(null)
      props?.onExitoEliminar?.(id)
    },
    onError: (err) => {
      setErrorEliminar(extraerMensajeError(err))
    },
  })

  const crearAnio = (params: { anio: number; activar: boolean }) => {
    setErrorCrear(null)
    mutacionCrear.mutate(params)
  }

  const activarAnio = (id: number) => {
    setErrorActivar(null)
    mutacionActivar.mutate(id)
  }

  const eliminarAnio = (id: number) => {
    setErrorEliminar(null)
    mutacionEliminar.mutate(id)
  }

  const limpiarErrorCrear = () => {
    setErrorCrear(null)
  }

  const limpiarErrorActivar = () => {
    setErrorActivar(null)
  }

  const limpiarErrorEliminar = () => {
    setErrorEliminar(null)
  }

  return {
    crearAnio,
    creando: mutacionCrear.isPending,
    errorCrear,
    limpiarErrorCrear,
    activarAnio,
    activando: mutacionActivar.isPending,
    errorActivar,
    limpiarErrorActivar,
    eliminarAnio,
    eliminando: mutacionEliminar.isPending,
    errorEliminar,
    limpiarErrorEliminar,
  }
}

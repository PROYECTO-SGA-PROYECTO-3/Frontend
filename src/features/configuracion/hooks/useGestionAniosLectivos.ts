import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarAniosLectivos, crearAnioLectivo, activarAnioLectivo } from '../api/aniosLectivosApi'
import { extraerMensajeError } from '@/shared/lib/axios'
import { useAnioLectivoStore } from '../store'
import type { AnioLectivo } from '../types'

export function useGestionAniosLectivos() {
  const queryClient = useQueryClient()
  const cargarAniosStore = useAnioLectivoStore((estado) => estado.cargarAnios)
  const seleccionarAnioStore = useAnioLectivoStore((estado) => estado.seleccionarAnio)

  const [anioNuevo, setAnioNuevo] = useState('')
  const [activarAlCrear, setActivarAlCrear] = useState(false)
  const [errorCrear, setErrorCrear] = useState<string | null>(null)

  const [anioAActivar, setAnioAActivar] = useState<AnioLectivo | null>(null)
  const [errorActivar, setErrorActivar] = useState<string | null>(null)

  const [anioParaPeriodos, setAnioParaPeriodos] = useState<AnioLectivo | null>(null)

  // Consulta de años lectivos
  const {
    data: anios = [],
    isLoading,
    error: errorCarga,
  } = useQuery({
    queryKey: ['aniosLectivos'],
    queryFn: listarAniosLectivos,
  })

  // Mutación para crear año lectivo
  const mutacionCrear = useMutation({
    mutationFn: async ({ anio, activar }: { anio: number; activar: boolean }) => {
      const creado = await crearAnioLectivo({ anio, activo: false })
      if (activar) {
        await activarAnioLectivo(creado.id)
        seleccionarAnioStore(creado.id)
      }
      return creado
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['aniosLectivos'] })
      await cargarAniosStore()
      setAnioNuevo('')
      setActivarAlCrear(false)
      setErrorCrear(null)
    },
    onError: (err) => {
      setErrorCrear(extraerMensajeError(err))
    },
  })

  // Mutación para activar año lectivo
  const mutacionActivar = useMutation({
    mutationFn: async (id: number) => {
      return await activarAnioLectivo(id)
    },
    onSuccess: async (_, id) => {
      seleccionarAnioStore(id)
      await queryClient.invalidateQueries({ queryKey: ['aniosLectivos'] })
      await cargarAniosStore()
      setAnioAActivar(null)
      setErrorActivar(null)
    },
    onError: (err) => {
      setErrorActivar(extraerMensajeError(err))
    },
  })

  const manejarSubmitCrear = (e: FormEvent) => {
    e.preventDefault()
    const valor = Number(anioNuevo.trim())
    if (!valor || valor < 2000 || valor > 2100) {
      setErrorCrear('Ingresa un año válido (ej. 2026).')
      return
    }
    setErrorCrear(null)
    mutacionCrear.mutate({ anio: valor, activar: activarAlCrear })
  }

  const solicitarActivacion = (anio: AnioLectivo) => {
    setErrorActivar(null)
    setAnioAActivar(anio)
  }

  const confirmarActivacion = () => {
    if (anioAActivar) {
      mutacionActivar.mutate(anioAActivar.id)
    }
  }

  const cancelarActivacion = () => {
    if (!mutacionActivar.isPending) {
      setAnioAActivar(null)
      setErrorActivar(null)
    }
  }

  const anioActivoActual = anios.find((a) => a.activo)

  return {
    anios,
    anioActivoActual,
    isLoading,
    errorCarga: errorCarga ? extraerMensajeError(errorCarga) : null,
    // Creación
    anioNuevo,
    setAnioNuevo,
    activarAlCrear,
    setActivarAlCrear,
    errorCrear,
    creando: mutacionCrear.isPending,
    manejarSubmitCrear,
    // Activación
    anioAActivar,
    errorActivar,
    activando: mutacionActivar.isPending,
    solicitarActivacion,
    confirmarActivacion,
    cancelarActivacion,
    // Periodos
    anioParaPeriodos,
    abrirPeriodos: setAnioParaPeriodos,
    cerrarPeriodos: () => setAnioParaPeriodos(null),
  }
}

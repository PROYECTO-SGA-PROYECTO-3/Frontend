import { useEffect, useState } from 'react'
import type { FiltroEstadoEstudiante } from '../types'

interface UseFiltroEstudiantesOpciones {
  onFiltroCambio?: () => void
  debounceMs?: number
}

/**
 * Hook responsable del estado de búsqueda, filtrado y debounce para el catálogo de estudiantes.
 */
export function useFiltroEstudiantes({
  onFiltroCambio,
  debounceMs = 400,
}: UseFiltroEstudiantesOpciones = {}) {
  const [busqueda, setBusqueda] = useState('')
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoEstudiante>('TODOS')
  const [filtroGrado, setFiltroGrado] = useState<number | ''>('')

  // Debounce del término de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setBusquedaDebounced(busqueda.trim())
      onFiltroCambio?.()
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [busqueda, debounceMs, onFiltroCambio])

  const cambiarEstado = (nuevoEstado: FiltroEstadoEstudiante) => {
    setFiltroEstado(nuevoEstado)
    onFiltroCambio?.()
  }

  const cambiarGrado = (nuevoGrado: number | '') => {
    setFiltroGrado(nuevoGrado)
    onFiltroCambio?.()
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setBusquedaDebounced('')
    setFiltroEstado('TODOS')
    setFiltroGrado('')
    onFiltroCambio?.()
  }

  const hayFiltrosActivos =
    busqueda.trim() !== '' || filtroEstado !== 'TODOS' || filtroGrado !== ''

  // Determinación de inclusión de inactivos para el backend
  const incluirInactivos = filtroEstado !== 'ACTIVOS'

  return {
    busqueda,
    setBusqueda,
    busquedaDebounced,
    filtroEstado,
    cambiarEstado,
    filtroGrado,
    cambiarGrado,
    incluirInactivos,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}

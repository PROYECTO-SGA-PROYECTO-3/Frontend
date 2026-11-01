import { useEffect, useState } from 'react'
import type { FiltroEstadoEstudiante } from '../types'

interface UseFiltroEstudiantesOpciones {
  debounceMs?: number
}

/**
 * Traducción de los tres estados de la UI al parámetro `activo` del backend:
 * undefined = todos, true = solo activos, false = solo inactivos.
 */
const ACTIVO_SEGUN_FILTRO: Record<FiltroEstadoEstudiante, boolean | undefined> = {
  TODOS: undefined,
  ACTIVOS: true,
  INACTIVOS: false,
}

/**
 * Hook responsable del estado de búsqueda, filtrado y debounce para el catálogo de estudiantes.
 * Entrega el término sin normalizar: useCatalogoEstudiantes lo normaliza en un único punto.
 */
export function useFiltroEstudiantes({
  debounceMs = 400,
}: UseFiltroEstudiantesOpciones = {}) {
  const [busqueda, setBusqueda] = useState('')
  const [busquedaDebounced, setBusquedaDebounced] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoEstudiante>('TODOS')
  const [filtroGrado, setFiltroGrado] = useState<number | ''>('')

  // Debounce del término de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setBusquedaDebounced(busqueda)
    }, debounceMs)

    return () => clearTimeout(handler)
  }, [busqueda, debounceMs])

  const limpiarFiltros = () => {
    setBusqueda('')
    setBusquedaDebounced('')
    setFiltroEstado('TODOS')
    setFiltroGrado('')
  }

  const hayFiltrosActivos =
    busqueda.trim() !== '' || filtroEstado !== 'TODOS' || filtroGrado !== ''

  // Traducción del filtro de la UI al parámetro del backend
  const activo = ACTIVO_SEGUN_FILTRO[filtroEstado]

  return {
    busqueda,
    setBusqueda,
    busquedaDebounced,
    filtroEstado,
    cambiarEstado: setFiltroEstado,
    filtroGrado,
    cambiarGrado: setFiltroGrado,
    activo,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}

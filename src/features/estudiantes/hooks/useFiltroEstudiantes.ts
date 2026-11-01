import { useEffect, useState } from 'react'
import type { FiltroEstadoEstudiante } from '../types'

interface UseFiltroEstudiantesOpciones {
  debounceMs?: number
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

  // Determinación de inclusión de inactivos para el backend
  const incluirInactivos = filtroEstado !== 'ACTIVOS'

  return {
    busqueda,
    setBusqueda,
    busquedaDebounced,
    filtroEstado,
    cambiarEstado: setFiltroEstado,
    filtroGrado,
    cambiarGrado: setFiltroGrado,
    incluirInactivos,
    hayFiltrosActivos,
    limpiarFiltros,
  }
}

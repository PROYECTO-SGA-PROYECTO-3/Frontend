import { useMemo, useState } from 'react'
import type { Asignatura, CriterioOrdenMateria } from '../types'

/**
 * Hook responsable exclusivamente de la lógica de búsqueda,
 * ordenamiento y cómputo de asignaturas visibles en el cliente.
 */
export function useFiltroMaterias(asignaturas: Asignatura[]) {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState<CriterioOrdenMateria>('alfabetico-asc')

  const materiasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    let resultado = asignaturas

    if (termino) {
      resultado = resultado.filter((materia) =>
        materia.nombre.toLowerCase().includes(termino),
      )
    }

    return [...resultado].sort((a, b) => {
      if (orden === 'alfabetico-asc') {
        return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      }
      if (orden === 'alfabetico-desc') {
        return b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' })
      }
      if (orden === 'recientes') {
        return b.id - a.id
      }
      return 0
    })
  }, [asignaturas, busqueda, orden])

  const hayFiltroActivo = Boolean(busqueda.trim())

  return {
    busqueda,
    setBusqueda,
    orden,
    setOrden,
    materiasFiltradas,
    totalMaterias: asignaturas.length,
    totalFiltradas: materiasFiltradas.length,
    hayFiltroActivo,
  }
}

import { useMemo, useState } from 'react'
import { nombreCompleto } from '@/shared/lib/utils'
import type { Docente, FiltroEstadoDocente, FiltroFirmaDocente, OrdenDocente } from '../types'

/**
 * Hook responsable exclusivamente de las operaciones en cliente sobre el listado de docentes:
 * búsqueda instantánea, filtrado por estado y firma, y ordenamiento.
 */
export function useFiltroDocentes(docentes: Docente[]) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoDocente>('TODOS')
  const [filtroFirma, setFiltroFirma] = useState<FiltroFirmaDocente>('TODOS')
  const [orden, setOrden] = useState<OrdenDocente>('NOMBRE_ASC')

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroEstado('TODOS')
    setFiltroFirma('TODOS')
    setOrden('NOMBRE_ASC')
  }

  const hayFiltroActivo =
    busqueda.trim() !== '' || filtroEstado !== 'TODOS' || filtroFirma !== 'TODOS'

  // Estadísticas globales sobre el conjunto actual
  const { totalActivos, totalInactivos, totalConFirma } = useMemo(() => {
    let activos = 0
    let conFirma = 0
    for (const d of docentes) {
      if (d.activo) activos++
      if (d.firmaUrl) conFirma++
    }
    return {
      totalActivos: activos,
      totalInactivos: docentes.length - activos,
      totalConFirma: conFirma,
    }
  }, [docentes])

  // Aplicación de filtros y orden
  const docentesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()

    return docentes
      .filter((docente) => {
        // Filtro por estado
        if (filtroEstado === 'ACTIVOS' && !docente.activo) return false
        if (filtroEstado === 'INACTIVOS' && docente.activo) return false

        // Filtro por firma
        if (filtroFirma === 'CON_FIRMA' && !docente.firmaUrl) return false
        if (filtroFirma === 'SIN_FIRMA' && Boolean(docente.firmaUrl)) return false

        // Búsqueda textual
        if (!q) return true

        const nombre = nombreCompleto(docente).toLowerCase()
        const doc = docente.documento.toLowerCase()
        const correo = docente.email.toLowerCase()
        const materias = docente.materias.map((m) => m.toLowerCase()).join(' ')

        return (
          nombre.includes(q) ||
          doc.includes(q) ||
          correo.includes(q) ||
          materias.includes(q)
        )
      })
      .sort((a, b) => {
        if (orden === 'NOMBRE_ASC') {
          return nombreCompleto(a).localeCompare(nombreCompleto(b), 'es')
        }
        if (orden === 'NOMBRE_DESC') {
          return nombreCompleto(b).localeCompare(nombreCompleto(a), 'es')
        }
        if (orden === 'DOCUMENTO_ASC') {
          return a.documento.localeCompare(b.documento, undefined, { numeric: true })
        }
        return 0
      })
  }, [docentes, busqueda, filtroEstado, filtroFirma, orden])

  return {
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    filtroFirma,
    setFiltroFirma,
    orden,
    setOrden,
    docentesFiltrados,
    totalDocentes: docentes.length,
    totalFiltrados: docentesFiltrados.length,
    totalActivos,
    totalInactivos,
    totalConFirma,
    hayFiltroActivo,
    limpiarFiltros,
  }
}

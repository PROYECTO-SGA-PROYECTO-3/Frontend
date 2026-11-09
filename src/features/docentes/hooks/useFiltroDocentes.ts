import { useMemo, useState } from 'react'
import { nombreCompleto } from '@/shared/lib/utils'
import type { Docente, FiltroEstadoDocente, FiltroFirmaDocente, OrdenDocente } from '../types'

/**
 * Hook responsable exclusivamente de las operaciones en cliente sobre el listado
 * de docentes: búsqueda instantánea, filtrado por estado y firma, y ordenamiento.
 *
 * Opera sobre la página ya descargada, no sobre la planta completa: `/api/docentes`
 * no acepta término de búsqueda. Por eso no deriva estadísticas, que se leerían
 * como totales de la institución; de los totales se encarga DocentesStats con el
 * dato global del servidor.
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
    hayFiltroActivo,
    limpiarFiltros,
  }
}

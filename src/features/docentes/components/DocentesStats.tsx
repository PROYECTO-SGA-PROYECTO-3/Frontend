import { FileCheck, GraduationCap, UserCheck, UserX } from 'lucide-react'
import { StatCard } from '@/shared/ui'
import type { ResumenDocentes } from '../types'

interface DocentesStatsProps {
  /** Conteos agregados del servidor. `null` mientras cargan o si la consulta falló. */
  resumen: ResumenDocentes | null
  /** Total del listado paginado: respaldo de la primera tarjeta si no hay resumen. */
  totalListado: number
}

const SIN_DATO = '—'
const PISTA_NO_DISPONIBLE = 'Resumen no disponible'

/**
 * Métricas del encabezado del directorio.
 *
 * Los valores vienen de `/docentes/resumen`, no de las filas visibles: antes se
 * contaban sobre la página descargada, así que con 5 por página "Planta Docente"
 * decía 5 aunque hubiera 12 registrados, y las cifras cambiaban al paginar o al
 * escribir en el buscador.
 *
 * Si el resumen no está disponible se muestra un guion en lugar de inventar un
 * número con los datos de la página.
 */
export function DocentesStats({ resumen, totalListado }: DocentesStatsProps) {
  const pista = (texto: string) => (resumen ? texto : PISTA_NO_DISPONIBLE)

  return (
    <section
      aria-label="Estadísticas de la planta docente"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        etiqueta="Planta Docente"
        valor={resumen?.total ?? totalListado}
        icono={GraduationCap}
        pista="Total de profesores registrados"
        color="brand"
      />

      <StatCard
        etiqueta="En Ejercicio"
        valor={resumen?.activos ?? SIN_DATO}
        icono={UserCheck}
        pista={pista('Docentes habilitados y activos')}
        color="accent"
      />

      <StatCard
        etiqueta="Inactivos"
        valor={resumen?.inactivos ?? SIN_DATO}
        icono={UserX}
        pista={pista('Sin acceso o suspendidos temporalmente')}
        color="blue"
      />

      <StatCard
        etiqueta="Firma Registrada"
        valor={resumen?.conFirma ?? SIN_DATO}
        icono={FileCheck}
        pista={pista('Aptos para firma de boletines y actas')}
        color="brand"
      />
    </section>
  )
}

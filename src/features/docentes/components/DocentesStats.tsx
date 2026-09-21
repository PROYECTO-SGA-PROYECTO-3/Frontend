import { FileCheck, GraduationCap, UserCheck, UserX } from 'lucide-react'
import { StatCard } from '@/shared/ui'

interface DocentesStatsProps {
  totalDocentes: number
  totalActivos: number
  totalInactivos: number
  totalConFirma: number
  hayFiltroActivo?: boolean
  totalFiltrados?: number
}

export function DocentesStats({
  totalDocentes,
  totalActivos,
  totalInactivos,
  totalConFirma,
  hayFiltroActivo = false,
  totalFiltrados = 0,
}: DocentesStatsProps) {
  return (
    <section
      aria-label="Estadísticas de la planta docente"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <StatCard
        etiqueta="Planta Docente"
        valor={totalDocentes}
        icono={GraduationCap}
        pista={
          hayFiltroActivo
            ? `${totalFiltrados} coinciden con los filtros aplicados`
            : 'Total de profesores registrados'
        }
        color="brand"
      />

      <StatCard
        etiqueta="En Ejercicio"
        valor={totalActivos}
        icono={UserCheck}
        pista="Docentes habilitados y activos"
        color="accent"
      />

      <StatCard
        etiqueta="Inactivos"
        valor={totalInactivos}
        icono={UserX}
        pista="Sin acceso o suspendidos temporalmente"
        color="blue"
      />

      <StatCard
        etiqueta="Firma Registrada"
        valor={totalConFirma}
        icono={FileCheck}
        pista="Aptos para firma de boletines y actas"
        color="brand"
      />
    </section>
  )
}

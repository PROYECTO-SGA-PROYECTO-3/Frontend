import { BookMarked, CheckCircle2, Search } from 'lucide-react'
import { StatCard } from '@/shared/ui/StatCard'

interface MateriasStatsProps {
  totalMaterias: number
  totalFiltradas: number
  hayFiltroActivo: boolean
}

export function MateriasStats({
  totalMaterias,
  totalFiltradas,
  hayFiltroActivo,
}: MateriasStatsProps) {
  return (
    <section aria-label="Resumen de catálogo" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        etiqueta="Catálogo Maestro"
        valor={totalMaterias}
        icono={BookMarked}
        pista="Asignaturas curriculares registradas"
        color="brand"
      />

      <StatCard
        etiqueta="Plan de Estudios"
        valor={totalMaterias > 0 ? 'Vigente' : 'Sin registros'}
        icono={CheckCircle2}
        pista="Listas para asignación en carga académica"
        color="accent"
      />

      {hayFiltroActivo ? (
        <StatCard
          etiqueta="Coincidencias de Búsqueda"
          valor={totalFiltradas}
          icono={Search}
          pista={`Filtradas de ${totalMaterias} registradas`}
          color="blue"
        />
      ) : (
        <StatCard
          etiqueta="Visibilidad"
          valor={`${totalMaterias} / ${totalMaterias}`}
          icono={Search}
          pista="Mostrando la totalidad del catálogo"
          color="blue"
        />
      )}
    </section>
  )
}


import { BookMarked, Search } from 'lucide-react'
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
    <section aria-label="Resumen de catálogo" className="flex flex-wrap gap-4">
      <div className="w-full max-w-xs">
        <StatCard
          etiqueta="Catálogo General"
          valor={totalMaterias}
          icono={BookMarked}
          pista="Asignaturas curriculares registradas"
          color="brand"
        />
      </div>

      {hayFiltroActivo && (
        <div className="w-full max-w-xs animate-in fade-in duration-200">
          <StatCard
            etiqueta="Resultados de Búsqueda"
            valor={totalFiltradas}
            icono={Search}
            pista={`Coincidencias de ${totalMaterias} registradas`}
            color="blue"
          />
        </div>
      )}
    </section>
  )
}

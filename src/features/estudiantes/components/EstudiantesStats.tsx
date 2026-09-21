import { BookOpen, CheckCircle2, GraduationCap, UserX } from 'lucide-react'
import { StatCard } from '@/shared/ui'
import type { Estudiante } from '../types'

interface EstudiantesStatsProps {
  totalGlobal: number
  estudiantesEnPagina: Estudiante[]
}

export function EstudiantesStats({ totalGlobal, estudiantesEnPagina }: EstudiantesStatsProps) {
  const activos = estudiantesEnPagina.filter((e) => e.activo).length
  const inactivos = estudiantesEnPagina.length - activos
  const matriculados = estudiantesEnPagina.filter(
    (e) => Boolean(e.gradoActualNombre) || Boolean(e.ultimaMatriculaGrado),
  ).length

  return (
    <section aria-label="Resumen de estudiantes" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        etiqueta="Total Registrados"
        valor={totalGlobal}
        icono={GraduationCap}
        color="brand"
        pista="Estudiantes en sistema"
      />
      <StatCard
        etiqueta="Activos (Página)"
        valor={activos}
        icono={CheckCircle2}
        color="blue"
        pista="Cuentas habilitadas"
      />
      <StatCard
        etiqueta="Inactivos (Página)"
        valor={inactivos}
        icono={UserX}
        color="accent"
        pista="Acceso suspendido"
      />
      <StatCard
        etiqueta="Matriculados (Página)"
        valor={matriculados}
        icono={BookOpen}
        color="brand"
        pista="Con curso asignado"
      />
    </section>
  )
}

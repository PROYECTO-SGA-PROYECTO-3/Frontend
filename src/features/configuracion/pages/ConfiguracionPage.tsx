import { PageHeader } from '@/layouts'
import { InstitucionSection } from '../components/InstitucionSection'
import { AniosLectivosSection } from '../components/AniosLectivosSection'

export default function Configuracion() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        raiz="Portal Administrativo"
        seccionActual="Configuración General"
      />

      <main className="flex-1 p-6 md:p-8 xl:p-10 max-w-[1600px] mx-auto w-full space-y-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Gestión Institucional y Académica
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configura los parámetros legales del colegio, identidad gráfica y el año lectivo que rige el sistema.
          </p>
        </div>

        {/* Sección 1: Configuración Institucional y Multimedia */}
        <InstitucionSection />

        {/* Sección 2: Años Lectivos y Periodos Académicos */}
        <AniosLectivosSection />
      </main>
    </div>
  )
}


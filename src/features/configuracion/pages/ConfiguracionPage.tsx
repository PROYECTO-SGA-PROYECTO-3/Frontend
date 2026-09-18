import { Navbar } from '@/components/layout/Navbar'
import { InstitucionSection } from '../components/InstitucionSection'
import { AniosLectivosSection } from '../components/AniosLectivosSection'

export default function Configuracion() {
  return (
    <div className="flex h-full flex-col">
      <Navbar
        titulo="Configuración General"
        subtitulo="Ajustes institucionales y régimen de años lectivos"
        sistemaEnLinea
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

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} IE FRAY ISIDORO de Montclar &bull; Sistema de Gestión Académica (SGA)
      </footer>
    </div>
  )
}

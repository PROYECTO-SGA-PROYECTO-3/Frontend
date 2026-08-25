import { Navbar } from '@/components/layout/Navbar'

export default function AdminDashboard() {
  return (
    <>
      <Navbar
        titulo="Panel de Control"
        subtitulo="Institución Educativa Agrícola Fray Isidoro de Montclar"
        sistemaEnLinea
      />
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Bienvenido al Panel de Administración</h2>
            <p className="text-sm text-slate-500">
              Gestión académica, administrativa y configuración institucional.
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-700">Contenido principal del panel de administración.</p>
          </div>
        </div>
      </main>
    </>
  )
}


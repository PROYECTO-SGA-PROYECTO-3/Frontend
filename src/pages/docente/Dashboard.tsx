import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerDashboardDocente } from '@/api/dashboard.api'
import { extraerMensajeError } from '@/api/axios'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/Spinner'
import { NavbarDocente } from '@/components/layout/NavbarDocente'
import { BannerBienvenidaDocente } from '@/components/docente/BannerBienvenidaDocente'
import { CargaAcademica } from '@/components/docente/CargaAcademica'
import { CierrePeriodo } from '@/components/docente/CierrePeriodo'
import { AlertasSeguimiento } from '@/components/docente/AlertasSeguimiento'
import type { DashboardDocente } from '@/types/dashboardDocente.types'

export default function DocenteDashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardDocente | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true

    obtenerDashboardDocente()
      .then((datos) => {
        if (vigente) setDashboard(datos)
      })
      .catch((err: unknown) => {
        if (vigente) setError(extraerMensajeError(err))
      })

    return () => {
      vigente = false
    }
  }, [])

  if (!usuario) return null

  return (
    <>
      <NavbarDocente usuario={usuario} cargo={dashboard?.docente.cargo ?? ''} seccionActual="Inicio" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {error ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-red-500 shadow-sm">
            {error}
          </p>
        ) : !dashboard ? (
          <div className="flex justify-center rounded-xl border border-slate-200 bg-white py-16 shadow-sm">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <BannerBienvenidaDocente
                nombre={dashboard.docente.nombreCompleto}
                planillasPendientes={dashboard.planillasPendientes}
                onCalificarAhora={() => navigate('/docente/planilla')}
                onVerCalendario={() => navigate('/calendario')}
              />
              <CargaAcademica clases={dashboard.clasesDeHoy} />
              <AlertasSeguimiento
                estudiantes={dashboard.estudiantesBajoRendimiento}
                onVerReporteCompleto={() => navigate('/docente/alertas-seguimiento')}
              />
            </div>

            <div className="flex flex-col gap-6">
              <CierrePeriodo {...dashboard.cierrePeriodo} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Institución Educativa Agrícola Fray Isidoro de Montclar. Todos los derechos reservados.
      </footer>
    </>
  )
}

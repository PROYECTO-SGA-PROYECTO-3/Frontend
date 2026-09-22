import { useNavigate } from 'react-router-dom'
import { extraerMensajeError } from '@/shared/lib/axios'
import { useAuth } from '@/features/auth'
import { NavbarDocente } from '@/layouts'
import { BannerBienvenida } from './BannerBienvenida'
import { DocenteDashboardSkeleton } from './DocenteDashboardSkeleton'
import { useDashboardDocente } from './hooks/useDashboardDocente'
import { ClasesHoy } from '@/features/carga-academica'
import { CierrePeriodo } from '@/features/periodos'
import { AlertasSeguimiento } from '@/features/seguimiento'
import { ProximosEventos, useEventosInstitucionales } from '@/features/eventos'
import { ErrorState } from '@/shared/ui/ErrorState'

export default function DocenteDashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const {
    data: dashboard,
    isLoading: cargandoDashboard,
    isError: hayErrorDashboard,
    error: errorDashboardObj,
    refetch: reintentarDashboard,
  } = useDashboardDocente()

  const { data: eventos = [] } = useEventosInstitucionales()

  if (!usuario) return null

  return (
    <>
      <NavbarDocente seccionActual="Inicio" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {hayErrorDashboard ? (
          <ErrorState
            titulo="Error al cargar el panel del docente"
            mensaje={extraerMensajeError(errorDashboardObj)}
            onRetry={() => reintentarDashboard()}
          />
        ) : cargandoDashboard || !dashboard ? (
          <DocenteDashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna Principal: Responsabilidades y Clases */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <BannerBienvenida
                nombre={dashboard.docente.nombreCompleto}
                planillasPendientes={dashboard.planillasPendientes}
                onCalificarAhora={() => navigate('/docente/planilla')}
                onVerCalendario={() => navigate('/calendario')}
              />

              <ClasesHoy clases={dashboard.clasesDeHoy} />

              <AlertasSeguimiento
                estudiantes={dashboard.estudiantesBajoRendimiento}
                planillasPendientes={dashboard.planillasPendientes}
                onSubirNotas={() => navigate('/docente/planilla')}
                onVerReporteCompleto={() => navigate('/docente/alertas-seguimiento')}
              />
            </div>

            {/* Columna Lateral: Periodo y Eventos Institucionales */}
            <div className="flex flex-col gap-6">
              <CierrePeriodo {...dashboard.cierrePeriodo} />
              <ProximosEventos eventos={eventos} />
            </div>
          </div>
        )}
      </main>
    </>
  )
}

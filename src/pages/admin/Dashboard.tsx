import {
	BookOpen,
	IdCard,
	Layers3,
	AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { obtenerDashboardAdmin } from "@/api/dashboard.api";
import { listarEventos } from "@/api/eventos.api";
import { extraerMensajeError } from "@/api/axios";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { HeroStatCard } from "@/components/ui/HeroStatCard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { ProximosEventos } from "@/components/eventos/ProximosEventos";

export default function Dashboard() {
	const {
		data: dashboard,
		isLoading: cargandoDashboard,
		error: errorDashboardObj,
	} = useQuery({
		queryKey: ["dashboardAdmin"],
		queryFn: obtenerDashboardAdmin,
		staleTime: 1000 * 60 * 5, // 5 minutos
	});

	const {
		data: eventos = [],
		isLoading: cargandoEventos,
		error: errorEventosObj,
	} = useQuery({
		queryKey: ["eventosInstitucionales"],
		queryFn: listarEventos,
		staleTime: 1000 * 60 * 15, // 15 minutos
	});

	const errorDashboard = errorDashboardObj
		? extraerMensajeError(errorDashboardObj)
		: null;
	const errorEventos = errorEventosObj
		? extraerMensajeError(errorEventosObj)
		: null;

	const estaCargando = cargandoDashboard || cargandoEventos;

	return (
		<div className="flex h-full flex-col">
			<Navbar
				titulo="Panel de Control"
				subtitulo="Institución Educativa Agrícola Fray Isidoro"
				sistemaEnLinea 
			/>

			<main className="flex-1 p-6 md:p-8 xl:p-10 max-w-[1600px] mx-auto w-full">
				<div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-slate-900">
							Resumen General
						</h2>
						<p className="mt-1 text-sm font-medium text-slate-500">
							Vista general del progreso académico y administrativo.
						</p>
					</div>
				</div>

				{estaCargando ? (
					<DashboardSkeleton />
				) : errorDashboard ? (
					<div className="mt-10 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-6 text-red-700 shadow-sm">
						<AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
						<div>
							<h3 className="font-semibold">Error al cargar métricas</h3>
							<p className="mt-1 text-sm opacity-90">{errorDashboard}</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)] xl:gap-8 xl:items-stretch">
						{/* Tarjeta Principal */}
						<HeroStatCard 
							totalEstudiantes={dashboard?.totalEstudiantes ?? 0}
							matriculasActivas={dashboard?.matriculasActivas ?? 0}
						/>

						{/* Métricas Secundarias */}
						<div className="flex flex-col justify-between gap-5">
							<StatCard
								etiqueta="Docentes Activos"
								valor={dashboard?.docentesActivos ?? 0}
								icono={IdCard}
								color="accent"
							/>
							<StatCard
								etiqueta="Total Asignaturas"
								valor={dashboard?.totalAsignaturas ?? 0}
								icono={BookOpen}
								color="blue"
							/>
							<StatCard
								etiqueta="Total Grados"
								valor={dashboard?.totalGrados ?? 0}
								icono={Layers3}
								color="brand"
							/>
						</div>

						{/* Próximos Eventos */}
						<div className="h-full">
							{errorEventos ? (
								<section className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-6 text-sm text-red-700 shadow-sm">
									<div className="text-center">
										<AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
										<p>{errorEventos}</p>
									</div>
								</section>
							) : (
								<ProximosEventos eventos={eventos} />
							)}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

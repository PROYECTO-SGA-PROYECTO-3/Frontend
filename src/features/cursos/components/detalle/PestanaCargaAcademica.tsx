import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import {
	ErrorState,
	Skeleton,
	SearchInput,
	Badge,
	Button,
	ToastNotificacion,
} from "@/shared/ui";
import type { CargaAcademica } from "@/shared/types/academico.types";
import { useCargaAcademicaCurso } from "../../hooks";
import { CargaAcademicaTable } from "./CargaAcademicaTable";
import { CargaAcademicaEmptyState } from "./CargaAcademicaEmptyState";

export interface PestanaCargaAcademicaProps {
	cursoId: number;
	nombreCurso?: string;
}

export function PestanaCargaAcademica({
	cursoId,
	nombreCurso,
}: PestanaCargaAcademicaProps) {
	const { cargas, totalCargas, isLoading, isError, error, refetch } =
		useCargaAcademicaCurso(cursoId);

	const [busqueda, setBusqueda] = useState("");
	const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
	const [cargaAReasignar, setCargaAReasignar] = useState<CargaAcademica | null>(
		null,
	);
	const [cargaARemover, setCargaARemover] = useState<CargaAcademica | null>(
		null,
	);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);

	const handleCerrarToast = () => {
		setMensajeExito(null);
	};

	const handleAbrirAsignar = () => {
		setModalAsignarAbierto(true);
	};

	const handleAbrirReasignar = (carga: CargaAcademica) => {
		setCargaAReasignar(carga);
	};

	const handleAbrirRemover = (carga: CargaAcademica) => {
		setCargaARemover(carga);
	};

	const handleLimpiarBusqueda = () => {
		setBusqueda("");
	};

	// Filtrado reactivo en memoria por asignatura o docente
	const cargasFiltradas = useMemo(() => {
		const query = busqueda.trim().toLowerCase();
		if (!query) return cargas;

		return cargas.filter(
			(c) =>
				c.nombreAsignatura.toLowerCase().includes(query) ||
				c.nombreDocente.toLowerCase().includes(query) ||
				c.documentoDocente.toLowerCase().includes(query),
		);
	}, [cargas, busqueda]);

	const hayFiltroActivo = busqueda.trim().length > 0;

	return (
		<div className="space-y-5">
			{/* Notificación flotante de confirmación (sin Layout Shift) */}
			<ToastNotificacion
				mensaje={mensajeExito}
				onCerrar={handleCerrarToast}
				tipo="exito"
			/>

			{/* 1. Estado de Carga con Skeleton en formato Tabla */}
			{isLoading && (
				<div
					className="space-y-4"
					aria-busy="true"
					aria-label="Cargando distribución de asignaturas del curso"
				>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
						<div className="flex items-center gap-3">
							<Skeleton className="h-6 w-28 rounded-full" />
							<Skeleton className="h-10 w-36 rounded-xl" />
						</div>
					</div>

					<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
						<div className="border-b border-slate-100 bg-slate-50/75 p-3.5 flex gap-4">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-4 w-20 text-center" />
							<Skeleton className="h-4 w-24 ml-auto" />
						</div>
						<div className="divide-y divide-slate-100 p-2 space-y-2">
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} className="flex items-center gap-4 py-3 px-2">
									<Skeleton className="h-4 w-8" />
									<Skeleton className="h-9 w-9 rounded-xl shrink-0" />
									<div className="space-y-1.5 flex-1">
										<Skeleton className="h-4 w-36" />
										<Skeleton className="h-3 w-20" />
									</div>
									<div className="space-y-1.5 flex-1">
										<Skeleton className="h-4 w-40" />
										<Skeleton className="h-3 w-24" />
									</div>
									<Skeleton className="h-5 w-16 rounded-full mx-auto" />
									<Skeleton className="h-8 w-16 rounded-lg ml-auto" />
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* 2. Estado de Error de Red */}
			{!isLoading && isError && (
				<ErrorState
					titulo="Error al consultar la carga académica del curso"
					mensaje={error}
					onRetry={() => refetch()}
					textoBoton="Reintentar consulta"
				/>
			)}

			{/* 3. Estado Vacío General (El curso no tiene materias asignadas aún) */}
			{!isLoading && !isError && totalCargas === 0 && (
				<CargaAcademicaEmptyState onAsignarMateria={handleAbrirAsignar} />
			)}

			{/* 4. Contenido Principal con Datos */}
			{!isLoading && !isError && totalCargas > 0 && (
				<div className="space-y-4">
					{/* Barra de herramientas superior */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="w-full sm:max-w-xs">
							<SearchInput
								value={busqueda}
								onChange={setBusqueda}
								placeholder="Buscar materia o docente..."
								aria-label="Buscar asignaturas o docentes en este curso"
							/>
						</div>

						<div className="flex items-center justify-between sm:justify-end gap-3">
							<Badge color="brand">
								{totalCargas} materia{totalCargas === 1 ? "" : "s"} asignada
								{totalCargas === 1 ? "" : "s"}
							</Badge>

							<Button
								type="button"
								onClick={handleAbrirAsignar}
								className="w-auto px-4 py-2 text-xs font-semibold"
							>
								<Plus size={16} aria-hidden="true" />
								<span>Asignar materia</span>
							</Button>
						</div>
					</div>

					{/* Tabla de asignaturas o Estado vacío tras búsqueda sin resultados */}
					{cargasFiltradas.length > 0 ? (
						<CargaAcademicaTable
							cargas={cargasFiltradas}
							onReasignarDocente={handleAbrirReasignar}
							onRemoverMateria={handleAbrirRemover}
						/>
					) : (
						<CargaAcademicaEmptyState
							esPorBusqueda={hayFiltroActivo}
							terminoBusqueda={busqueda}
							onLimpiarBusqueda={handleLimpiarBusqueda}
						/>
					)}
				</div>
			)}
		</div>
	);
}

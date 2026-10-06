import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import {
	ErrorState,
	SearchInput,
	Badge,
	Button,
	ToastNotificacion,
	DialogoConfirmacion,
} from "@/shared/ui";
import type { CargaAcademica } from "@/shared/types/academico.types";
import { useCargaAcademicaCurso, useRemoverMateria } from "../../hooks";
import { CargaAcademicaTable } from "./CargaAcademicaTable";
import { CargaAcademicaEmptyState } from "./CargaAcademicaEmptyState";
import { CargaAcademicaSkeleton } from "./CargaAcademicaSkeleton";
import { AsignarMateriaModal } from "./AsignarMateriaModal";
import { ReasignarDocenteModal } from "./ReasignarDocenteModal";

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

	const {
		removerMateria,
		estaRemoviendo,
		errorRemover,
		resetearError: resetearErrorRemover,
	} = useRemoverMateria(cursoId);

	const [busqueda, setBusqueda] = useState("");
	const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
	const [cargaAReasignar, setCargaAReasignar] = useState<CargaAcademica | null>(
		null,
	);
	const [cargaARemover, setCargaARemover] = useState<CargaAcademica | null>(
		null,
	);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);

	const tituloCurso = nombreCurso ?? `Curso #${cursoId}`;

	const handleCerrarToast = () => {
		setMensajeExito(null);
	};

	const handleAbrirAsignar = () => {
		setModalAsignarAbierto(true);
	};

	const handleCerrarAsignar = () => {
		setModalAsignarAbierto(false);
	};

	const handleAbrirReasignar = (carga: CargaAcademica) => {
		setCargaAReasignar(carga);
	};

	const handleCerrarReasignar = () => {
		setCargaAReasignar(null);
	};

	const handleAbrirRemover = (carga: CargaAcademica) => {
		resetearErrorRemover();
		setCargaARemover(carga);
	};

	const handleCancelarRemover = () => {
		if (estaRemoviendo) return;
		resetearErrorRemover();
		setCargaARemover(null);
	};

	const handleConfirmarRemover = async () => {
		if (!cargaARemover) return;

		try {
			await removerMateria(cargaARemover.id);
			const nombre = cargaARemover.nombreAsignatura;
			setCargaARemover(null);
			setMensajeExito(
				`La materia "${nombre}" ha sido removida del curso exitosamente.`,
			);
		} catch {
			// errorRemover se maneja reactivamente en DialogoConfirmacion
		}
	};

	const handleExitoAsignacion = (nombreAsignatura: string) => {
		setMensajeExito(
			`La materia "${nombreAsignatura}" ha sido asignada a ${tituloCurso} exitosamente.`,
		);
	};

	const handleExitoReasignacion = (
		nombreAsignatura: string,
		nuevoDocente: string,
	) => {
		setMensajeExito(
			`Se reasignó a "${nuevoDocente}" como docente titular de ${nombreAsignatura}.`,
		);
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

	const asignaturasYaAsignadasIds = useMemo(() => {
		return cargas.map((c) => c.asignaturaId);
	}, [cargas]);

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
			{isLoading && <CargaAcademicaSkeleton />}

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
				<div className="space-y-4">
					<div className="flex justify-end">
						<Button
							type="button"
							onClick={handleAbrirAsignar}
							className="w-auto px-4 py-2 text-xs font-semibold"
						>
							<Plus size={16} aria-hidden="true" />
							<span>Asignar materia</span>
						</Button>
					</div>
					<CargaAcademicaEmptyState onAsignarMateria={handleAbrirAsignar} />
				</div>
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
								onClear={handleLimpiarBusqueda}
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

			{/* Modal: Asignar nueva materia */}
			<AsignarMateriaModal
				abierto={modalAsignarAbierto}
				cursoId={cursoId}
				nombreCurso={tituloCurso}
				asignaturasYaAsignadasIds={asignaturasYaAsignadasIds}
				onCerrar={handleCerrarAsignar}
				onExito={handleExitoAsignacion}
			/>

			{/* Modal: Reasignar docente titular */}
			<ReasignarDocenteModal
				abierto={Boolean(cargaAReasignar)}
				carga={cargaAReasignar}
				cursoId={cursoId}
				onCerrar={handleCerrarReasignar}
				onExito={handleExitoReasignacion}
			/>

			{/* Diálogo de Confirmación: Remover materia del curso */}
			<DialogoConfirmacion
				abierto={Boolean(cargaARemover)}
				titulo="¿Remover materia del curso?"
				mensaje={`¿Estás seguro de que deseas remover la asignatura "${cargaARemover?.nombreAsignatura}" de ${tituloCurso}? La materia no se borrará del colegio, pero ya no formará parte de este curso en el año escolar actual.`}
				error={errorRemover ?? undefined}
				procesando={estaRemoviendo}
				textoConfirmar="Remover materia"
				varianteConfirmar="peligro"
				onConfirmar={handleConfirmarRemover}
				onCancelar={handleCancelarRemover}
			/>
		</div>
	);
}

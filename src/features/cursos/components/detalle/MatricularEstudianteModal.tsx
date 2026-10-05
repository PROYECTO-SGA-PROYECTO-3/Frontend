import { useState } from "react";
import { X, UserPlus, Check, AlertCircle, Loader2 } from "lucide-react";
import { nombreCompleto } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import type { Estudiante } from "@/features/estudiantes";
import { useMatricularEstudiante } from "../../hooks";
import { BuscadorEstudianteCombobox } from "./BuscadorEstudianteCombobox";
import { EstudianteSeleccionadoCard } from "./EstudianteSeleccionadoCard";

export interface MatricularEstudianteModalProps {
	abierto: boolean;
	cursoId: number;
	nombreCurso: string;
	onCerrar: () => void;
	onExito: (nombreEstudiante: string) => void;
}

export function MatricularEstudianteModal(
	props: MatricularEstudianteModalProps,
) {
	if (!props.abierto) return null;
	return <MatricularEstudianteDialog {...props} />;
}

function MatricularEstudianteDialog({
	cursoId,
	nombreCurso,
	onCerrar,
	onExito,
}: MatricularEstudianteModalProps) {
	const [estudianteSeleccionado, setEstudianteSeleccionado] =
		useState<Estudiante | null>(null);

	const {
		matricularEstudiante,
		estaMatriculando,
		errorMatricula,
		resetearError,
	} = useMatricularEstudiante(cursoId);

	const handleConfirmarMatricula = async () => {
		if (!estudianteSeleccionado) return;

		try {
			await matricularEstudiante({
				documentoEstudiante: estudianteSeleccionado.documento,
			});
			const nombre = nombreCompleto(estudianteSeleccionado);
			onExito(nombre);
			onCerrar();
		} catch {
			// React Query captura y expone el error reactivamente a través de errorMatricula
		}
	};

	const handleCambiarEstudiante = () => {
		resetearError();
		setEstudianteSeleccionado(null);
	};

	const handleKeyDownDialogo = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Escape" && !estaMatriculando) {
			e.stopPropagation();
			onCerrar();
		}
	};

	const handleFondoClick = () => {
		if (!estaMatriculando) {
			onCerrar();
		}
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-matricular-titulo"
			onKeyDown={handleKeyDownDialogo}
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
		>
			{/* Fondo desenfocado */}
			<div
				className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
				onClick={handleFondoClick}
			/>

			{/* Contenedor del Modal */}
			<div className="relative w-full max-w-lg overflow-visible rounded-2xl bg-white shadow-xl transition-all">
				{/* Cabecera */}
				<div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
							<UserPlus size={20} aria-hidden="true" />
						</div>
						<div>
							<h3
								id="modal-matricular-titulo"
								className="text-lg font-bold text-slate-900"
							>
								Matricular en {nombreCurso}
							</h3>
							<p className="text-xs text-slate-500">
								Asignación oficial de estudiante al grado escolar
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onCerrar}
						disabled={estaMatriculando}
						aria-label="Cerrar ventana"
						className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50"
					>
						<X size={18} aria-hidden="true" />
					</button>
				</div>

				{/* Cuerpo */}
				<div className="p-5 sm:p-6 space-y-4">
					{errorMatricula && (
						<div
							role="alert"
							className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-800"
						>
							<AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
							<div className="flex-1">
								<p className="font-semibold">Error al matricular</p>
								<p className="mt-0.5">{errorMatricula}</p>
							</div>
						</div>
					)}

					{!estudianteSeleccionado ? (
						<BuscadorEstudianteCombobox
							onSeleccionar={(est) => {
								resetearError();
								setEstudianteSeleccionado(est);
							}}
							disabled={estaMatriculando}
						/>
					) : (
						<EstudianteSeleccionadoCard
							estudiante={estudianteSeleccionado}
							nombreCurso={nombreCurso}
							onCambiar={handleCambiarEstudiante}
							disabled={estaMatriculando}
						/>
					)}
				</div>

				{/* Pie de Acciones */}
				<div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 p-4 sm:px-6">
					<Button
						type="button"
						variant="secondary"
						onClick={onCerrar}
						disabled={estaMatriculando}
						className="w-auto px-4"
					>
						Cancelar
					</Button>

					<Button
						type="button"
						onClick={handleConfirmarMatricula}
						disabled={!estudianteSeleccionado || estaMatriculando}
						className="w-auto px-4"
					>
						{estaMatriculando ? (
							<>
								<Loader2 size={16} className="animate-spin" />
								<span>Matriculando...</span>
							</>
						) : (
							<>
								<Check size={16} />
								<span>Confirmar Matrícula</span>
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

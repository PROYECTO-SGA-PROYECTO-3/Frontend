import { RotateCcw, IdCard } from "lucide-react";
import { nombreCompleto } from "@/shared/lib/utils";
import { Avatar} from "@/shared/ui";
import type { Estudiante } from "@/features/estudiantes";

export interface EstudianteSeleccionadoCardProps {
	estudiante: Estudiante;
	nombreCurso: string;
	onCambiar: () => void;
	disabled?: boolean;
}

export function EstudianteSeleccionadoCard({
	estudiante,
	nombreCurso,
	onCambiar,
	disabled = false,
}: EstudianteSeleccionadoCardProps) {
	const nombre = nombreCompleto(estudiante);

	return (
		<div className="space-y-3">
			{/* Tarjeta del Alumno Elegido */}
			<div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
				<div className="flex items-center justify-between pb-3 border-b border-brand-100">
					<span className="text-xs font-semibold uppercase tracking-wider text-brand-800">
						Estudiante Seleccionado
					</span>
					<button
						type="button"
						onClick={onCambiar}
						disabled={disabled}
						className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-900 transition disabled:opacity-50"
					>
						<RotateCcw size={13} aria-hidden="true" />
						<span>Cambiar</span>
					</button>
				</div>

				<div className="mt-3 flex items-center gap-3">
					<Avatar nombre={nombre} tamano="md" />
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-bold text-slate-900">{nombre}</p>
						<div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
							<IdCard
								size={14}
								className="text-slate-400 shrink-0"
								aria-hidden="true"
							/>
							<span className="font-mono">Documento: {estudiante.documento}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Resumen de Asignación */}
			<div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-600 space-y-1.5">
				<div className="flex justify-between">
					<span className="text-slate-500">Curso destino:</span>
					<span className="font-semibold text-slate-900">{nombreCurso}</span>
				</div>
			</div>
		</div>
	);
}

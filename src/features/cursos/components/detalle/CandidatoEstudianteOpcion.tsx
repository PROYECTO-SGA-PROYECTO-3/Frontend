import { IdCard } from "lucide-react";
import { nombreCompleto } from "@/shared/lib/utils";
import { Avatar, Badge } from "@/shared/ui";
import type { Estudiante } from "@/features/estudiantes";

export interface CandidatoEstudianteOpcionProps {
	candidato: Estudiante;
	onSeleccionar: (estudiante: Estudiante) => void;
}

export function CandidatoEstudianteOpcion({
	candidato,
	onSeleccionar,
}: CandidatoEstudianteOpcionProps) {
	const nombre = nombreCompleto(candidato);
	const yaMatriculado = Boolean(candidato.gradoActualId);

	return (
		<button
			type="button"
			disabled={yaMatriculado}
			onClick={() => onSeleccionar(candidato)}
			className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition ${
				yaMatriculado
					? "bg-slate-50/70 cursor-not-allowed opacity-60"
					: "cursor-pointer hover:bg-brand-50/60"
			}`}
		>
			<div className="flex items-center gap-3 min-w-0">
				<Avatar nombre={nombre} tamano="sm" />
				<div className="min-w-0">
					<p className="truncate text-xs sm:text-sm font-semibold text-slate-900">
						{nombre}
					</p>
					<div className="flex items-center gap-1.5 text-xs text-slate-400">
						<IdCard size={13} className="shrink-0" />
						<span className="font-mono">{candidato.documento}</span>
					</div>
				</div>
			</div>

			<div className="shrink-0">
				{yaMatriculado ? (
					<Badge color="slate">
						Matriculado en {candidato.gradoActualNombre}
					</Badge>
				) : (
					<Badge color="brand">Disponible</Badge>
				)}
			</div>
		</button>
	);
}

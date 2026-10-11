import { UserCheck } from "lucide-react";
import { useDocentesCandidatos } from "../hooks/useDocentesCandidatos";

interface CursoDirectorSelectProps {
	id?: string;
	value: number | null;
	onChange: (id: number | null) => void;
	disabled?: boolean;
	docenteActual?: {
		id: number;
		nombre: string;
	} | null;
}

/**
 * Componente modular para la selección de director de grupo de un curso o grado escolar.
 * - Encapsula la consulta perezosa y cacheada del catálogo de docentes.
 * - Ofrece retroalimentación visual de carga y formato accesible con diseño institucional.
 */
export function CursoDirectorSelect({
	id = "director-curso-select",
	value,
	onChange,
	disabled = false,
	docenteActual = null,
}: CursoDirectorSelectProps) {
	const { docentes, isLoading } = useDocentesCandidatos({
		enabled: true,
		docenteActual,
	});

	return (
		<div className="space-y-1.5 pt-1">
			<label
				htmlFor={id}
				className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
			>
				<UserCheck size={14} className="text-brand-600" aria-hidden="true" />
				<span>Director de Grupo</span>
				<span className="font-normal text-slate-400">(Opcional)</span>
			</label>

			<div className="relative">
				<select
					id={id}
					value={value ?? ""}
					onChange={(e) => {
						const val = e.target.value;
						onChange(val ? Number(val) : null);
					}}
					disabled={disabled || isLoading}
					className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
				>
					<option value="">-- Sin director asignado --</option>
					{isLoading ? (
						<option disabled>Cargando docentes disponibles...</option>
					) : (
						docentes.map((docente) => (
							<option key={docente.id} value={docente.id}>
								{docente.nombreCompleto} (CC {docente.documento})
							</option>
						))
					)}
				</select>

				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
					<svg
						className="h-4 w-4 fill-current"
						viewBox="0 0 20 20"
						aria-hidden="true"
					>
						<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
					</svg>
				</div>
			</div>

			<p className="text-xs text-slate-400">
				Docente responsable de la orientación y acompañamiento del curso.
			</p>
		</div>
	);
}

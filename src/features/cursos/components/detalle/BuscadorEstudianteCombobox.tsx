import { useState, useDeferredValue, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import {
	useBuscarCandidatosEstudiantes,
	type Estudiante,
} from "@/features/estudiantes";
import { CandidatoEstudianteOpcion } from "./CandidatoEstudianteOpcion";

export interface BuscadorEstudianteComboboxProps {
	onSeleccionar: (estudiante: Estudiante) => void;
	disabled?: boolean;
}

export function BuscadorEstudianteCombobox({
	onSeleccionar,
	disabled = false,
}: BuscadorEstudianteComboboxProps) {
	const [termino, setTermino] = useState("");
	const terminoDiferido = useDeferredValue(termino);
	const [desplegableAbierto, setDesplegableAbierto] = useState(false);

	const contenedorRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { candidatos, estaBuscando, isError, error } =
		useBuscarCandidatosEstudiantes(terminoDiferido, { limite: 5 });

	useEffect(() => {
		const handleClickAfuera = (e: MouseEvent) => {
			if (
				contenedorRef.current &&
				!contenedorRef.current.contains(e.target as Node)
			) {
				setDesplegableAbierto(false);
			}
		};
		document.addEventListener("mousedown", handleClickAfuera);
		return () => document.removeEventListener("mousedown", handleClickAfuera);
	}, []);

	const handleSeleccionarCandidato = (candidato: Estudiante) => {
		if (candidato.gradoActualId) return;
		onSeleccionar(candidato);
		setTermino("");
		setDesplegableAbierto(false);
	};

	const handleLimpiarInput = () => {
		setTermino("");
		setDesplegableAbierto(false);
		inputRef.current?.focus();
	};

	const handleCambiarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTermino(e.target.value);
		setDesplegableAbierto(true);
	};

	const handleFocusInput = () => {
		if (termino.trim().length >= 2) {
			setDesplegableAbierto(true);
		}
	};

	return (
		<div className="space-y-1.5" ref={contenedorRef}>
			<label
				htmlFor="combobox-estudiante-input"
				className="block text-xs font-semibold text-slate-700"
			>
				Buscar estudiante por nombre o documento:
			</label>

			<div className="relative">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
					{estaBuscando ? (
						<Loader2 size={17} className="animate-spin text-brand-600" />
					) : (
						<Search size={17} />
					)}
				</div>

				<input
					ref={inputRef}
					id="combobox-estudiante-input"
					type="text"
					value={termino}
					onChange={handleCambiarInput}
					onFocus={handleFocusInput}
					placeholder="Ej: 10203040 o Laura Méndez..."
					autoComplete="off"
					disabled={disabled}
					className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 disabled:bg-slate-50"
				/>

				{termino && (
					<button
						type="button"
						onClick={handleLimpiarInput}
						className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
						aria-label="Limpiar campo de búsqueda"
					>
						<X size={15} />
					</button>
				)}

				{desplegableAbierto && termino.trim().length >= 2 && (
					<div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
						{estaBuscando && candidatos.length === 0 && (
							<div className="flex items-center justify-center gap-2 py-6 text-xs text-slate-400">
								<Loader2 size={16} className="animate-spin text-brand-600" />
								<span>Buscando coincidencias...</span>
							</div>
						)}

						{!estaBuscando && isError && (
							<div className="p-4 text-center text-xs text-red-600">
								{error ?? "Error al buscar estudiantes."}
							</div>
						)}

						{!estaBuscando && !isError && candidatos.length === 0 && (
							<div className="p-4 text-center text-xs text-slate-500">
								No se encontraron estudiantes que coincidan con &ldquo;{termino}&rdquo;.
							</div>
						)}

						{!estaBuscando &&
							candidatos.map((candidato) => (
								<CandidatoEstudianteOpcion
									key={candidato.id}
									candidato={candidato}
									onSeleccionar={handleSeleccionarCandidato}
								/>
							))}
					</div>
				)}
			</div>

			<p className="text-xs text-slate-400">
				Escribe al menos 2 caracteres para desplegar resultados coincidentes.
			</p>
		</div>
	);
}

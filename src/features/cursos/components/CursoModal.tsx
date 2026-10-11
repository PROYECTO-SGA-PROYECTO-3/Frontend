import { useEffect, useState } from "react";
import { School, X, AlertCircle } from "lucide-react";
import { Button, Input } from "@/shared/ui";
import type { Grado, SolicitudGrado } from "@/shared/types/academico.types";
import { CursoDirectorSelect } from "./CursoDirectorSelect";

interface CursoModalProps {
	abierto: boolean;
	cursoAEditar?: Grado | null;
	guardando: boolean;
	errorServidor?: string | null;
	existeDuplicado: (nombre: string, ignorarId?: number) => boolean;
	onGuardar: (datos: SolicitudGrado) => Promise<void>;
	onCerrar: () => void;
}

const MAX_CARACTERES = 50;

export function CursoModal(props: CursoModalProps) {
	if (!props.abierto) return null;

	return <CursoModalDialog key={props.cursoAEditar?.id ?? "nuevo"} {...props} />;
}

function CursoModalDialog({
	cursoAEditar,
	guardando,
	errorServidor,
	existeDuplicado,
	onGuardar,
	onCerrar,
}: CursoModalProps) {
	const [nombre, setNombre] = useState(cursoAEditar?.nombre ?? "");
	const [directorSeleccionado, setDirectorSeleccionado] = useState<
		number | null
	>(cursoAEditar?.directorId ?? null);
	const [errorLocal, setErrorLocal] = useState<string | null>(null);
	const esEdicion = Boolean(cursoAEditar);

	// Cierre accesible con tecla Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !guardando) {
				onCerrar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [guardando, onCerrar]);

	const longitud = nombre.trim().length;
	const esDuplicado = existeDuplicado(nombre, cursoAEditar?.id);

	const manejarEnvio = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const nombreLimpio = nombre.trim();

		if (!nombreLimpio) {
			setErrorLocal("El nombre del curso o grado es obligatorio.");
			return;
		}

		if (nombreLimpio.length < 2) {
			setErrorLocal("El nombre debe tener al menos 2 caracteres.");
			return;
		}

		if (esDuplicado) {
			setErrorLocal("Ya existe un grado registrado con este nombre.");
			return;
		}

		setErrorLocal(null);

		await onGuardar({
			nombre: nombreLimpio,
			directorId: directorSeleccionado,
		});
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-curso-titulo"
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4 animate-in fade-in duration-200"
		>
			<div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all">
				{/* Cabecera del modal */}
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
							<School size={20} aria-hidden="true" />
						</div>
						<div>
							<h2 id="modal-curso-titulo" className="text-lg font-bold text-slate-900">
								{esEdicion ? "Editar Grado Escolar" : "Nuevo Grado Escolar"}
							</h2>
							<p className="text-xs text-slate-500">
								{esEdicion
									? "Modifica los datos del grado y su dirección en el catálogo"
									: "Ingresa los datos para registrar un nuevo grado en el catálogo"}
							</p>
						</div>
					</div>
					<button
						type="button"
						aria-label="Cerrar modal"
						onClick={onCerrar}
						disabled={guardando}
						className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
					>
						<X size={18} />
					</button>
				</div>

				{/* Formulario */}
				<form onSubmit={manejarEnvio} className="mt-5 space-y-4">
					{/* Campo: Nombre del Grado */}
					<div>
						<Input
							id="nombre-curso-input"
							label="Nombre del Grado / Curso"
							placeholder="Ej. Primero A, Grado 10°, Preescolar..."
							value={nombre}
							onChange={(e) => {
								setNombre(e.target.value);
								if (errorLocal) setErrorLocal(null);
							}}
							maxLength={MAX_CARACTERES}
							autoFocus
							disabled={guardando}
							error={errorLocal ?? undefined}
						/>

						<div className="mt-1 flex items-center justify-between text-xs text-slate-400">
							<span>Mínimo 2 caracteres</span>
							<span>
								{longitud}/{MAX_CARACTERES}
							</span>
						</div>
					</div>

					{/* Campo: Selector de Director de Grupo */}
					<CursoDirectorSelect
						value={directorSeleccionado}
						onChange={setDirectorSeleccionado}
						disabled={guardando}
						docenteActual={
							cursoAEditar?.directorId
								? {
										id: cursoAEditar.directorId,
										nombre: cursoAEditar.nombreDirector ?? "Director asignado",
									}
								: null
						}
					/>

					{/* Advertencia de duplicado */}
					{esDuplicado && (
						<div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
							<AlertCircle size={14} className="shrink-0" aria-hidden="true" />
							<span>Ya existe un curso registrado con este nombre en el sistema.</span>
						</div>
					)}

					{/* Error del servidor */}
					{errorServidor && (
						<div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
							{errorServidor}
						</div>
					)}

					{/* Acciones */}
					<div className="mt-6 flex justify-end gap-3 pt-2">
						<div className="w-auto">
							<Button
								type="button"
								variant="secondary"
								onClick={onCerrar}
								disabled={guardando}
							>
								Cancelar
							</Button>
						</div>
						<div className="w-auto">
							<Button
								type="submit"
								variant="primary"
								isLoading={guardando}
								disabled={!nombre.trim() || esDuplicado}
							>
								{esEdicion ? "Guardar Cambios" : "Registrar Grado"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

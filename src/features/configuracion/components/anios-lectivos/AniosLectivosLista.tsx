import { AlertCircle, Calendar } from "lucide-react";
import type { AnioLectivo } from "../../types";
import { AnioLectivoFila } from "./AnioLectivoFila";
import { AniosLectivosSkeleton } from "./AniosLectivosSkeleton";

interface AniosLectivosListaProps {
	isLoading: boolean;
	errorCarga: string | null;
	anios: AnioLectivo[];
	onGestionarPeriodos: (anio: AnioLectivo) => void;
	onActivarAnio: (anio: AnioLectivo) => void;
	onEliminarAnio: (anio: AnioLectivo) => void;
}

export function AniosLectivosLista({
	isLoading,
	errorCarga,
	anios,
	onGestionarPeriodos,
	onActivarAnio,
	onEliminarAnio,
}: AniosLectivosListaProps) {
	if (isLoading) {
		return <AniosLectivosSkeleton />;
	}

	if (errorCarga) {
		return (
			<div className="p-8 text-center text-sm text-red-600">
				<AlertCircle size={24} className="mx-auto mb-2 text-red-500" />
				<p className="font-semibold">Error al cargar los años lectivos</p>
				<p className="mt-1 text-xs text-red-500">{errorCarga}</p>
			</div>
		);
	}

	if (anios.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center">
				<Calendar size={36} className="text-slate-300" />
				<p className="mt-3 text-sm font-semibold text-slate-700">
					No hay años lectivos registrados
				</p>
				<p className="mt-1 max-w-sm text-xs text-slate-400">
					Crea un nuevo año lectivo para comenzar a gestionar periodos, cursos y
					calificaciones en la institución.
				</p>
			</div>
		);
	}

	const aniosOrdenados = [...anios].sort((a, b) => b.anio - a.anio);

	return (
		<div className="divide-y divide-slate-100">
			{aniosOrdenados.map((anio) => (
				<AnioLectivoFila
					key={anio.id}
					anio={anio}
					onGestionarPeriodos={onGestionarPeriodos}
					onActivarAnio={onActivarAnio}
					onEliminarAnio={onEliminarAnio}
				/>
			))}
		</div>
	);
}

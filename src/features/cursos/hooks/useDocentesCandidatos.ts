import { useQuery } from "@tanstack/react-query";
import {
	obtenerCatalogoDocentes,
	type DocenteCatalogo,
} from "@/features/docentes";

interface UseDocentesCandidatosOpciones {
	enabled?: boolean;
	docenteActual?: {
		id: number;
		nombre: string;
	} | null;
}

export function useDocentesCandidatos({
	enabled = false,
	docenteActual = null,
}: UseDocentesCandidatosOpciones = {}) {
	const {
		data: docentes = [],
		isLoading,
		isError,
	} = useQuery<DocenteCatalogo[]>({
		queryKey: ["docentes", "catalogo"],
		queryFn: () => obtenerCatalogoDocentes(false),
		enabled,
		staleTime: 1000 * 60 * 15, // 15 minutos en caché
		select: (listaDocentes) => {
			if (docenteActual && !listaDocentes.some((d) => d.id === docenteActual.id)) {
				return [
					{
						id: docenteActual.id,
						nombreCompleto: docenteActual.nombre,
						documento: "Asignado",
					},
					...listaDocentes,
				];
			}
			return listaDocentes;
		},
	});

	return { docentes, isLoading, isError };
}

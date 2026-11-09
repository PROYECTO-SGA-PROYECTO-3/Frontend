import { useQuery } from "@tanstack/react-query";
import {
	DOCENTES_QUERY_KEYS,
	obtenerCatalogoDocentes,
	type DocenteCatalogo,
} from "@/features/docentes";

// El catálogo liviano se consulta siempre sin inactivos: un solo valor alimenta
// la clave de caché y el parámetro, para que no puedan divergir.
const INCLUIR_INACTIVOS = false;

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
		queryKey: DOCENTES_QUERY_KEYS.catalogo(INCLUIR_INACTIVOS),
		queryFn: () => obtenerCatalogoDocentes(INCLUIR_INACTIVOS),
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

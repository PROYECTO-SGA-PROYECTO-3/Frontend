import { useQuery } from "@tanstack/react-query";
import { extraerMensajeError } from "@/shared/lib/axios";
import type { CargaAcademica } from "@/shared/types/academico.types";
import { listarCargaPorGrado } from "../api/cursosApi";
import { CURSOS_QUERY_KEYS } from "./queryKeys";

/**
 * Hook responsable de consultar la carga académica asignada a un grado/curso.
 */
export function useCargaAcademicaCurso(gradoId: number, anio?: number) {
	const idValido = Number.isInteger(gradoId) && gradoId > 0;

	const {
		data: cargas = [],
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery<CargaAcademica[], Error>({
		queryKey: CURSOS_QUERY_KEYS.cargas(gradoId, anio),
		queryFn: () => listarCargaPorGrado(gradoId, anio),
		enabled: idValido,
		staleTime: 1000 * 60 * 3, // 3 minutos en caché
	});

	return {
		cargas,
		totalCargas: cargas.length,
		isLoading,
		isError,
		error: error ? extraerMensajeError(error) : null,
		refetch,
		isFetching,
	};
}

import { useQuery } from "@tanstack/react-query";
import { extraerMensajeError } from "@/shared/lib/axios";
import type { Matricula } from "@/shared/types/matricula.types";
import { listarEstudiantesPorGrado } from "../api/cursosApi";
import { CURSOS_QUERY_KEYS } from "./queryKeys";

/**
 * Hook responsable de consultar la lista de estudiantes matriculados en un grado/curso.
 */
export function useEstudiantesCurso(gradoId: number, anio?: number) {
	const idValido = Number.isInteger(gradoId) && gradoId > 0;

	const {
		data: estudiantes = [],
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery<Matricula[], Error>({
		queryKey: CURSOS_QUERY_KEYS.estudiantes(gradoId, anio),
		queryFn: () => listarEstudiantesPorGrado(gradoId, anio),
		enabled: idValido,
		staleTime: 1000 * 60 * 3,
	});

	return {
		estudiantes,
		totalEstudiantes: estudiantes.length,
		isLoading,
		isError,
		error: error ? extraerMensajeError(error) : null,
		refetch,
		isFetching,
	};
}

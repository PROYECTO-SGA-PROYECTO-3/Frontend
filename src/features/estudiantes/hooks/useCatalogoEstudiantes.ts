import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listarEstudiantes } from "../api/estudiantesApi";
import type { Estudiante, ParametrosListarEstudiantes } from "../types";
import type { PaginaSpring } from "@/shared/types/api.types";

export const ESTUDIANTES_QUERY_KEY = ["estudiantes"] as const;

interface UseCatalogoEstudiantesOpciones {
	tamanoInicial?: number;
	incluirInactivos?: boolean;
	termino?: string;
	gradoId?: number;
	sortBy?: string;
	direction?: "ASC" | "DESC";
}

/**
 * Hook responsable de la paginación, filtrado y sincronización con el backend Spring Boot
 * mediante React Query. La paginación se delega 100% al servidor.
 */
export function useCatalogoEstudiantes({
	tamanoInicial = 10,
	incluirInactivos = true,
	termino,
	gradoId,
	sortBy = "PRIMER_NOMBRE",
	direction = "ASC",
}: UseCatalogoEstudiantesOpciones = {}) {
	const [pagina, setPagina] = useState(0);
	const [tamanoPagina, setTamanoPagina] = useState(tamanoInicial);

	// Punto único de normalización del término: alimenta la clave de caché y los parámetros
	const terminoNormalizado = termino?.trim() || undefined;

	// Reiniciar a la página 0 cuando cambie cualquier filtro del backend
	const claveFiltros = `${terminoNormalizado ?? ""}__${gradoId ?? ""}__${incluirInactivos}`;
	const [ultimaClaveFiltros, setUltimaClaveFiltros] = useState(claveFiltros);

	if (claveFiltros !== ultimaClaveFiltros) {
		setUltimaClaveFiltros(claveFiltros);
		setPagina(0);
	}

	const parametros: ParametrosListarEstudiantes = {
		pagina,
		tamanoPagina,
		incluirInactivos,
		termino: terminoNormalizado,
		gradoId,
		sortBy,
		direction,
	};

	const {
		data: resultado,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
	} = useQuery<PaginaSpring<Estudiante>, Error>({
		queryKey: [...ESTUDIANTES_QUERY_KEY, parametros],
		queryFn: () => listarEstudiantes(parametros),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 3, // 3 minutos de frescura en caché
	});

	return {
		estudiantes: resultado?.content ?? [],
		totalElementos: resultado?.page.totalElements ?? 0,
		totalPaginas: resultado?.page.totalPages ?? 0,
		pagina: resultado?.page.number ?? pagina,
		tamanoPagina,
		setPagina,
		setTamanoPagina,
		isLoading,
		isFetching,
		isError,
		error,
		refetch,
	};
}

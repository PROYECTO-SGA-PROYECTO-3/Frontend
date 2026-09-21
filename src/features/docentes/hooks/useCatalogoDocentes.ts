import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { extraerMensajeError } from "@/shared/lib/axios";
import { listarDocentes } from "../api/docentesApi";
import type { Docente, ParametrosListarDocentes } from "../types";
import type { PaginaSpring } from "@/shared/types/api.types";

export const DOCENTES_QUERY_KEY = ["docentes"] as const;

interface UseCatalogoDocentesOpciones {
	tamanoInicial?: number;
	incluirInactivos?: boolean;
}

/**
 * Hook responsable exclusivamente de la consulta paginada y sincronización
 * del catálogo de docentes con el servidor mediante React Query.
 */
export function useCatalogoDocentes({
	tamanoInicial = 5,
	incluirInactivos = true,
}: UseCatalogoDocentesOpciones = {}) {
	const [pagina, setPagina] = useState(0);
	const [tamanoPagina, setTamanoPagina] = useState(tamanoInicial);

	const parametros: ParametrosListarDocentes = {
		pagina,
		tamanoPagina,
		incluirInactivos,
		sortBy: "PRIMER_NOMBRE",
		direction: "ASC",
	};

	const {
		data: resultado,
		isLoading,
		isError,
		error,
		refetch,
		isFetching,
	} = useQuery<PaginaSpring<Docente>, Error>({
		queryKey: [...DOCENTES_QUERY_KEY, parametros],
		queryFn: () => listarDocentes(parametros),
		staleTime: 1000 * 60 * 5, // 5 minutos de frescura
	});

	const docentes = resultado?.content ?? [];
	const totalElementos = resultado?.page.totalElements ?? 0;
	const totalPaginas = resultado?.page.totalPages ?? 0;

	return {
		resultado,
		docentes,
		totalElementos,
		totalPaginas,
		pagina,
		tamanoPagina,
		setPagina,
		setTamanoPagina,
		isLoading,
		isError,
		error: error ? extraerMensajeError(error) : null,
		refetch,
		isFetching,
	};
}

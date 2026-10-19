import { useQuery } from "@tanstack/react-query";
import { listarPeriodos } from "../api/periodosApi";
import { extraerMensajeError } from "@/shared/lib";
import type { Periodo } from "../types";

export function usePeriodosQuery(anioId: number) {
	const {
		data: periodos = [],
		isLoading,
		error,
		refetch,
	} = useQuery<Periodo[]>({
		queryKey: ["periodos", anioId],
		queryFn: () => listarPeriodos(anioId),
		enabled: Boolean(anioId),
	});

	return {
		periodos,
		isLoading,
		errorCarga: error ? extraerMensajeError(error) : null,
		refetch,
	};
}

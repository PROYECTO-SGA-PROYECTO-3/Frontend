import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extraerMensajeError } from "@/shared/lib/axios";
import type { SolicitudReasignarDocente } from "@/shared/types/academico.types";
import { reasignarDocenteCarga } from "../api/cursosApi";
import { CURSOS_QUERY_KEYS } from "./queryKeys";

/**
 * Hook responsable de cambiar el docente titular asignado a una asignatura del curso.
 */
export function useReasignarDocente(cursoId: number) {
	const queryClient = useQueryClient();

	const mutacion = useMutation({
		mutationFn: ({
			cargaId,
			datos,
		}: {
			cargaId: number;
			datos: SolicitudReasignarDocente;
		}) => reasignarDocenteCarga(cargaId, datos),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CURSOS_QUERY_KEYS.cargas(cursoId),
			});
		},
	});

	return {
		reasignarDocente: mutacion.mutateAsync,
		estaReasignando: mutacion.isPending,
		errorReasignar: mutacion.error ? extraerMensajeError(mutacion.error) : null,
		resetearError: mutacion.reset,
	};
}

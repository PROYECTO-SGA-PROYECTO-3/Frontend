import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extraerMensajeError } from "@/shared/lib/axios";
import type { SolicitudCrearMatricula } from "@/shared/types/matricula.types";
import { matricularEstudianteEnCurso } from "../api/cursosApi";
import { CURSOS_QUERY_KEYS } from "./queryKeys";

export function useMatricularEstudiante(cursoId: number) {
	const queryClient = useQueryClient();

	const mutacion = useMutation({
		mutationFn: (datos: Omit<SolicitudCrearMatricula, "gradoId">) =>
			matricularEstudianteEnCurso({ ...datos, gradoId: cursoId }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CURSOS_QUERY_KEYS.estudiantes(cursoId),
			});
		},
	});

	return {
		matricularEstudiante: mutacion.mutateAsync,
		estaMatriculando: mutacion.isPending,
		errorMatricula: mutacion.error ? extraerMensajeError(mutacion.error) : null,
		resetearError: mutacion.reset,
	};
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	crearPeriodo,
	actualizarPeriodo,
	cerrarPeriodo,
	reabrirPeriodo,
	eliminarPeriodo,
} from "../api/periodosApi";
import { extraerMensajeError } from "@/shared/lib";
import type { Periodo, SolicitudPeriodo } from "../types";

interface UsePeriodosMutationsProps {
	anioId: number;
	onExitoGuardar?: (periodo: Periodo) => void;
	onExitoAlternar?: (periodo: Periodo) => void;
	onExitoEliminar?: (id: number) => void;
}

export function usePeriodosMutations({
	anioId,
	onExitoGuardar,
	onExitoAlternar,
	onExitoEliminar,
}: UsePeriodosMutationsProps) {
	const queryClient = useQueryClient();
	const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
	const [errorAlternar, setErrorAlternar] = useState<string | null>(null);
	const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

	// Mutación para crear / actualizar periodo
	const mutacionGuardar = useMutation({
		mutationFn: async ({
			id,
			datos,
		}: {
			id?: number;
			datos: SolicitudPeriodo;
		}) => {
			if (id) {
				return await actualizarPeriodo(id, datos);
			}
			return await crearPeriodo(datos);
		},
		onSuccess: (resultado) => {
			queryClient.invalidateQueries({ queryKey: ["periodos", anioId] });
			setErrorGuardar(null);
			onExitoGuardar?.(resultado);
		},
		onError: (err) => {
			setErrorGuardar(extraerMensajeError(err));
		},
	});

	// Mutación para alternar estado (cerrar / reabrir)
	const mutacionAlternar = useMutation({
		mutationFn: async (periodo: Periodo) => {
			if (periodo.cerradoParaDocentes) {
				return await reabrirPeriodo(periodo.id);
			}
			return await cerrarPeriodo(periodo.id);
		},
		onSuccess: (resultado) => {
			queryClient.invalidateQueries({ queryKey: ["periodos", anioId] });
			setErrorAlternar(null);
			onExitoAlternar?.(resultado);
		},
		onError: (err) => {
			setErrorAlternar(extraerMensajeError(err));
		},
	});

	// Mutación para eliminar periodo condicionalmente
	const mutacionEliminar = useMutation({
		mutationFn: async (id: number) => {
			return await eliminarPeriodo(id);
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: ["periodos", anioId] });
			setErrorEliminar(null);
			onExitoEliminar?.(id);
		},
		onError: (err) => {
			setErrorEliminar(extraerMensajeError(err));
		},
	});

	const guardarPeriodo = (datos: SolicitudPeriodo, id?: number) => {
		setErrorGuardar(null);
		mutacionGuardar.mutate({ id, datos });
	};

	const alternarEstado = (periodo: Periodo) => {
		setErrorAlternar(null);
		mutacionAlternar.mutate(periodo);
	};

	const eliminar = (id: number) => {
		setErrorEliminar(null);
		mutacionEliminar.mutate(id);
	};

	const limpiarErrorGuardar = () => setErrorGuardar(null);
	const limpiarErrorAlternar = () => setErrorAlternar(null);
	const limpiarErrorEliminar = () => setErrorEliminar(null);

	return {
		guardarPeriodo,
		guardando: mutacionGuardar.isPending,
		errorGuardar,
		limpiarErrorGuardar,
		alternarEstado,
		alternandoEstado: mutacionAlternar.isPending,
		errorAlternar,
		limpiarErrorAlternar,
		eliminarPeriodo: eliminar,
		eliminando: mutacionEliminar.isPending,
		errorEliminar,
		limpiarErrorEliminar,
	};
}

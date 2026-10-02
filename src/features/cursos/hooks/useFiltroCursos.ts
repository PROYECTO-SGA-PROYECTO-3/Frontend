import { useMemo, useState } from 'react'
import type { Grado } from '@/shared/types/academico.types'
import type { CriterioOrdenCurso, FiltrosCurso } from '../types'

export function useFiltroCursos(cursos: Grado[]) {
	const [busqueda, setBusqueda] = useState("");
	const [estadoDirector, setEstadoDirector] =
		useState<NonNullable<FiltrosCurso["estadoDirector"]>>("TODOS");
	const [orden, setOrden] = useState<CriterioOrdenCurso>("nombre-asc");

	const cursosFiltrados = useMemo(() => {
		const termino = busqueda.trim().toLowerCase();
		let resultado = cursos;

		if (termino) {
			resultado = resultado.filter(
				(curso) =>
					curso.nombre.toLowerCase().includes(termino) ||
					(curso.nombreDirector &&
						curso.nombreDirector.toLowerCase().includes(termino)),
			);
		}

		if (estadoDirector === "CON_DIRECTOR") {
			resultado = resultado.filter((curso) => Boolean(curso.directorId));
		} else if (estadoDirector === "SIN_DIRECTOR") {
			resultado = resultado.filter((curso) => !curso.directorId);
		}

		return [...resultado].sort((a, b) => {
			if (orden === "nombre-asc") {
				return a.nombre.localeCompare(b.nombre, "es", {
					numeric: true,
					sensitivity: "base",
				});
			}
			if (orden === "nombre-desc") {
				return b.nombre.localeCompare(a.nombre, "es", {
					numeric: true,
					sensitivity: "base",
				});
			}
			if (orden === "id-asc") {
				return a.id - b.id;
			}
			if (orden === "id-desc") {
				return b.id - a.id;
			}
			return 0;
		});
	}, [cursos, busqueda, estadoDirector, orden]);

	const hayFiltroActivo = Boolean(busqueda.trim()) || estadoDirector !== "TODOS";

	const limpiarFiltros = () => {
		setBusqueda("");
		setEstadoDirector("TODOS");
		setOrden("nombre-asc");
	};

	return {
		busqueda,
		setBusqueda,
		estadoDirector,
		setEstadoDirector,
		orden,
		setOrden,
		cursosFiltrados,
		totalCursos: cursos.length,
		totalFiltrados: cursosFiltrados.length,
		hayFiltroActivo,
		limpiarFiltros,
	};
}

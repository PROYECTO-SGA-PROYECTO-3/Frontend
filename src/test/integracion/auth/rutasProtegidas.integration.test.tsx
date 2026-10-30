import { beforeEach, describe, expect, it } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { rutasApp } from "@/app/router";
import { useAuthStore } from "@/features/auth/store";
import { admin, docente, estudiante } from "@/test/utils/fixtures/usuarios";
import { iniciarServidorMsw } from "@/test/utils/server";

function renderizarConRuta(rutaInicial: string) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: Infinity },
			mutations: { retry: false },
		},
	});

	const router = createMemoryRouter(rutasApp, {
		initialEntries: [rutaInicial],
	});

	return render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>,
	);
}

describe("Control de acceso y navegación en el sistema", () => {
	// Intercepta las llamadas residuales de red para que los endpoints no respondan con error no controlado
	iniciarServidorMsw();

	beforeEach(() => {
		useAuthStore.setState({
			token: null,
			usuario: null,
			isAuthenticated: false,
			motivoCierre: null,
		});
	});

	const rutasPrivadasAnonimas = [
		{ seccion: "al panel de administración (/admin)", ruta: "/admin" },
		{
			seccion: "a la planilla de notas del docente (/docente/planilla)",
			ruta: "/docente/planilla",
		},
		{
			seccion: "a las calificaciones del estudiante (/estudiante/calificaciones)",
			ruta: "/estudiante/calificaciones",
		},
	] as const;

	it.each(rutasPrivadasAnonimas)(
		"pide iniciar sesión cuando un usuario no autenticado intenta entrar $seccion",
		async ({ ruta }) => {
			renderizarConRuta(ruta);

			expect(
				await screen.findByRole("button", { name: /ingresar a la plataforma/i }),
			).toBeInTheDocument();
			expect(screen.getByRole("heading", { name: /bienvenido/i })).toBeInTheDocument();
		},
	);

	const accesosPorRol = [
		{
			rol: "ADMIN",
			nombreRol: "administrador",
			ruta: "/admin",
			usuarioFixture: admin.respuesta,
			itemMenu: "Estudiantes",
		},
		{
			rol: "DOCENTE",
			nombreRol: "docente",
			ruta: "/docente",
			usuarioFixture: docente.respuesta,
			itemMenu: "Planilla de Calificaciones",
		},
		{
			rol: "ESTUDIANTE",
			nombreRol: "estudiante",
			ruta: "/estudiante",
			usuarioFixture: estudiante.respuesta,
			itemMenu: "Calificaciones",
		},
	] as const;

	it.each(accesosPorRol)(
		"muestra el menú correspondiente cuando entra un usuario con rol de $nombreRol",
		async ({ ruta, usuarioFixture, itemMenu }) => {
			useAuthStore.setState({
				token: "token-valido-prueba",
				usuario: usuarioFixture,
				isAuthenticated: true,
			});

			renderizarConRuta(ruta);

			expect(
				await screen.findByRole("complementary", {
					name: /barra lateral de navegación/i,
				}),
			).toBeInTheDocument();
			expect(screen.getByText(itemMenu)).toBeInTheDocument();
			expect(
				screen.queryByRole("heading", { name: /acceso restringido/i }),
			).not.toBeInTheDocument();
		},
	);

	const intentosNoPermitidos = [
		{
			caso: "un estudiante intenta entrar a la sección de administración",
			ruta: "/admin/estudiantes",
			usuarioFixture: estudiante.respuesta,
		},
		{
			caso: "un docente intenta entrar a la configuración institucional",
			ruta: "/admin/configuracion",
			usuarioFixture: docente.respuesta,
		},
		{
			caso: "un estudiante intenta entrar a la planilla de un profesor",
			ruta: "/docente/planilla",
			usuarioFixture: estudiante.respuesta,
		},
		{
			caso: "un administrador intenta entrar a la vista de estudiante",
			ruta: "/estudiante/calificaciones",
			usuarioFixture: admin.respuesta,
		},
	] as const;

	it.each(intentosNoPermitidos)(
		"muestra pantalla de acceso restringido cuando $caso",
		async ({ ruta, usuarioFixture }) => {
			useAuthStore.setState({
				token: "token-valido-prueba",
				usuario: usuarioFixture,
				isAuthenticated: true,
			});

			renderizarConRuta(ruta);

			expect(
				await screen.findByRole("heading", { name: /acceso restringido/i }),
			).toBeInTheDocument();
			expect(
				screen.getByText(/no tienes permisos para ver esta sección/i),
			).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /ir a mi panel/i }),
			).toBeInTheDocument();
		},
	);

	it("saca al usuario al login inmediatamente si cierra la sesión mientras está en una pantalla privada", async () => {
		useAuthStore.setState({
			token: "token-valido-admin",
			usuario: admin.respuesta,
			isAuthenticated: true,
		});

		renderizarConRuta("/admin");

		expect(
			await screen.findByRole("complementary", {
				name: /barra lateral de navegación/i,
			}),
		).toBeInTheDocument();

		act(() => {
			useAuthStore.getState().cerrarSesion("voluntario");
		});

		await waitFor(() => {
			expect(screen.getByRole("heading", { name: /bienvenido/i })).toBeInTheDocument();
			expect(
				screen.queryByRole("complementary", {
					name: /barra lateral de navegación/i,
				}),
			).not.toBeInTheDocument();
		});
	});
});

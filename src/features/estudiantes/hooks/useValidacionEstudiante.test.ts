import { describe, expect, it } from "vitest";
import { crearEsquemaEstudiante } from "./useValidacionEstudiante";

describe("Validación de Datos de Estudiante", () => {
	const baseValida = {
		primerNombre: "Ana",
		primerApellido: "Gomez",
		documento: "1098765432",
		email: "ana.gomez@iedescanse.edu.co",
		contrasena: "claveSegura123",
	};

	const CASOS_INVALIDOS_REGISTRO = [
		{
			motivo: "falta el primer nombre",
			cambio: { primerNombre: "" },
			campoEsperado: "primerNombre",
		},
		{
			motivo: "falta el primer apellido",
			cambio: { primerApellido: "" },
			campoEsperado: "primerApellido",
		},
		{
			motivo: "el documento tiene menos de 3 caracteres",
			cambio: { documento: "12" },
			campoEsperado: "documento",
		},
		{
			motivo: "falta el documento de identidad",
			cambio: { documento: "" },
			campoEsperado: "documento",
		},
		{
			motivo: "el correo no tiene un formato válido",
			cambio: { email: "correo-invalido" },
			campoEsperado: "email",
		},
		{
			motivo: "falta el correo institucional",
			cambio: { email: "" },
			campoEsperado: "email",
		},
		{
			motivo: "la contraseña inicial tiene menos de 8 caracteres",
			cambio: { contrasena: "1234567" },
			campoEsperado: "contrasena",
		},
	];

	describe("Registro de nuevo estudiante", () => {
		const esquema = crearEsquemaEstudiante(false);

		it("aprueba el registro cuando se diligencian todos los datos obligatorios del alumno", () => {
			expect(esquema.safeParse(baseValida).success).toBe(true);
		});

		it.each(CASOS_INVALIDOS_REGISTRO)(
			"rechaza la matrícula inicial si $motivo",
			({ cambio, campoEsperado }) => {
				const res = esquema.safeParse({ ...baseValida, ...cambio });
				expect(res.success).toBe(false);
				if (!res.success) {
					expect(res.error.issues.some((i) => i.path.includes(campoEsperado))).toBe(
						true,
					);
				}
			},
		);
	});

	describe("Actualización de estudiante existente", () => {
		const esquema = crearEsquemaEstudiante(true);

		it("permite actualizar los datos personales sin forzar a reescribir documento, correo ni credenciales", () => {
			const res = esquema.safeParse({
				primerNombre: "Ana",
				primerApellido: "Gomez",
			});
			expect(res.success).toBe(true);
		});

		it("impide dejar en blanco el primer nombre o primer apellido al editar", () => {
			expect(
				esquema.safeParse({ primerNombre: "", primerApellido: "Gomez" }).success,
			).toBe(false);
			expect(
				esquema.safeParse({ primerNombre: "Ana", primerApellido: "" }).success,
			).toBe(false);
		});
	});
});

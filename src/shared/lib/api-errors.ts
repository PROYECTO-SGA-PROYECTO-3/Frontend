import axios from "axios";

const ERRORES_HTTP_GENERICOS = new Set([
	"Bad Request",
	"Internal Server Error",
	"Unauthorized",
	"Forbidden",
	"Not Found",
]);

/**
 * Función pura que inspecciona el cuerpo/payload de error del backend
 * (Spring Boot DTO, validation fields, default attributes o string plano)
 * y retorna un mensaje legible si está presente.
 */
export function extraerMensajeDePayload(datos: unknown): string | null {
	if (!datos) return null;

	if (typeof datos === "string" && datos.trim().length > 0) {
		return datos.trim();
	}

	if (typeof datos === "object") {
		const d = datos as Record<string, unknown>;

		// 1. Atributo en español o estándar en inglés de Spring Boot
		const mensajeDirecto = d.mensaje ?? d.message;
		if (typeof mensajeDirecto === "string" && mensajeDirecto.trim().length > 0) {
			return mensajeDirecto.trim();
		}

		// 2. Errores de validación estructurados por campo
		if (d.campos && typeof d.campos === "object") {
			const mensajes = Object.values(d.campos)
				.filter((m): m is string => typeof m === "string" && m.trim().length > 0);
			if (mensajes.length > 0) return mensajes.join(". ");
		}

		// 3. Atributo 'error' siempre que sea descriptivo y no un estado HTTP genérico
		if (typeof d.error === "string" && d.error.trim().length > 0) {
			const errorTxt = d.error.trim();
			if (!ERRORES_HTTP_GENERICOS.has(errorTxt)) {
				return errorTxt;
			}
		}
	}

	return null;
}

/** Extrae el mensaje legible de un error de Axios o genérico */
export function extraerMensajeError(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const mensajePayload = extraerMensajeDePayload(error.response?.data);
		return mensajePayload ?? error.message;
	}
	return error instanceof Error ? error.message : "Ocurrió un error inesperado";
}

/**
 * Versión async de extraerMensajeError para descargas:
 * cuando responseType es "blob", un error 404/500 también llega como Blob
 * en vez de JSON, por lo que hay que decodificarlo primero.
 */
export async function extraerMensajeErrorDescarga(
	error: unknown,
	mensajePorDefecto: string,
): Promise<string> {
	if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
		try {
			const texto = await error.response.data.text();
			const cuerpo: unknown = JSON.parse(texto);
			return extraerMensajeDePayload(cuerpo) ?? mensajePorDefecto;
		} catch {
			return mensajePorDefecto;
		}
	}
	return extraerMensajeError(error);
}

/** Extrae el nombre real del archivo desde el header Content-Disposition */
export function extraerNombreArchivoDescarga(
	contentDisposition?: string,
): string | null {
	const coincidencia = contentDisposition
		? /filename="([^"]+)"/.exec(contentDisposition)
		: null;
	return coincidencia?.[1] ?? null;
}

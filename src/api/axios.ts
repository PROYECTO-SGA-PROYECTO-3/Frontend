import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";
import type { ErrorApi, ErrorValidacion } from "@/types/api.types";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? import.meta.env.VITE_BACKEND_API ?? "http://localhost:8080/api",
	timeout: 15000,
});

// Adjunta el Bearer token en cada request leyendo el store directamente
// (no como hook — los interceptors corren fuera del árbol de React)
axiosClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.set("Authorization", `Bearer ${token}`);
	}
	return config;
});

// Manejo centralizado de errores:
// - 401 en /auth/login → credenciales inválidas, se deja pasar para que el formulario lo muestre
// - 401 en cualquier otra ruta → sesión vencida, limpiar sesión y redirigir
axiosClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const esIntentoDeLogin = error.config?.url?.includes("/auth/login");
		if (error.response?.status === 401 && !esIntentoDeLogin) {
			useAuthStore.getState().cerrarSesion();
			window.location.assign("/login");
		}
		return Promise.reject(error);
	},
);

// El backend devuelve el DTO directamente en el body (sin sobre { data, message }),
// por eso cada método desempaqueta response.data y retorna el tipo T.
export const api = {
	get: <T>(url: string, config?: AxiosRequestConfig) =>
		axiosClient.get<T>(url, config).then((r) => r.data),

	post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.post<T>(url, data, config).then((r) => r.data),

	put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.put<T>(url, data, config).then((r) => r.data),

	patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
		axiosClient.patch<T>(url, data, config).then((r) => r.data),

	delete: <T>(url: string, config?: AxiosRequestConfig) =>
		axiosClient.delete<T>(url, config).then((r) => r.data),

	// Retorna la respuesta completa (no solo .data) porque quien la use necesita
	// también los headers (Content-Disposition) para el nombre del archivo descargado.
	getBlob: (url: string, config?: AxiosRequestConfig) =>
		axiosClient.get<Blob>(url, { ...config, responseType: "blob" }),
};

// ---------------------------------------------------------------------------
// Helpers para extraer mensajes de error de forma uniforme en toda la app
// ---------------------------------------------------------------------------

/** Extrae el mensaje legible de un error de Axios o genérico */
export function extraerMensajeError(error: unknown): string {
	if (axios.isAxiosError<ErrorApi | ErrorValidacion>(error)) {
		const datos = error.response?.data;
		if (datos && "mensaje" in datos) return datos.mensaje;
		if (datos && "campos" in datos) return Object.values(datos.campos).join(" ");
		return error.message;
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
			const cuerpo = JSON.parse(texto) as { mensaje?: string };
			return cuerpo.mensaje ?? mensajePorDefecto;
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

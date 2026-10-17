import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth";

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
// - 401 en cualquier otra ruta → sesión vencida, limpiar sesión y redirigir conservando la ruta de origen
axiosClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const esIntentoDeLogin = error.config?.url?.includes("/auth/login");
		if (error.response?.status === 401 && !esIntentoDeLogin) {
			useAuthStore.getState().cerrarSesion('expirada');
			const rutaActual = window.location.pathname + window.location.search;
			const queryRedirect =
				rutaActual && !rutaActual.startsWith("/login") && rutaActual !== "/"
					? `?redirect=${encodeURIComponent(rutaActual)}`
					: "";
			window.location.assign(`/login${queryRedirect}`);
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


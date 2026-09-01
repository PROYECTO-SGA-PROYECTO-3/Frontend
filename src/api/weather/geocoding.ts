import type { UbicacionGeo } from "@/types/weather.types";
import { GEOCODING_URL } from "./config";

/**
 * Obtiene el nombre del municipio y departamento a partir de coordenadas GPS.
 */
export async function geocodificarInverso(
	lat: number,
	lon: number,
): Promise<Partial<UbicacionGeo>> {
	try {
		const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`;
		const res = await fetch(url);
		if (!res.ok) return {};
		const data = await res.json();
		const nombreCiudad =
			data.locality ||
			data.city ||
			data.principalSubdivision ||
			"Ubicación Actual";
		return {
			name: nombreCiudad,
			admin1: data.principalSubdivision,
			country: data.countryName || "Colombia",
			country_code: data.countryCode || "CO",
		};
	} catch {
		return {};
	}
}

/**
 * Busca ubicaciones por nombre de municipio o ciudad mediante la API de Geocoding de Open-Meteo.
 */
export async function buscarUbicaciones(
	query: string,
): Promise<UbicacionGeo[]> {
	if (!query || query.trim().length < 2) return [];

	const url = `${GEOCODING_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=es&format=json`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error("No se pudo conectar con el servicio de geolocalización");
	}

	const data = await res.json();
	if (!data.results) return [];

	return data.results.map((r: any) => ({
		id: r.id,
		name: r.name,
		latitude: r.latitude,
		longitude: r.longitude,
		elevation: r.elevation,
		country: r.country,
		country_code: r.country_code,
		admin1: r.admin1,
		admin2: r.admin2,
		timezone: r.timezone,
	}));
}

import type { UbicacionGeo } from "@/types/weather.types";

export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Ubicación por defecto de la institución (Mocoa / Descanse, Colombia)
export const UBICACION_PREDETERMINADA: UbicacionGeo = {
	id: 1,
	name: "Mocoa (IE Agrícola)",
	latitude: 1.1528,
	longitude: -76.6467,
	admin1: "Putumayo",
	country: "Colombia",
	country_code: "CO",
	timezone: "America/Bogota",
};

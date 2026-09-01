import type {
	UbicacionGeo,
	DatosClimaCompletos,
	PronosticoHora,
	PronosticoDia,
} from "@/types/weather.types";
import { FORECAST_URL } from "./config";
import { interpretarCodigoWMO } from "./wmo-interpreter";

/**
 * Obtiene el pronóstico completo (actual, próximas 24 horas y 7 días) para las coordenadas indicadas.
 */
export async function obtenerPronostico(
	lat: number,
	lon: number,
	ubicacionInfo?: UbicacionGeo,
): Promise<DatosClimaCompletos> {
	const params = new URLSearchParams({
		latitude: lat.toString(),
		longitude: lon.toString(),
		current: [
			"temperature_2m",
			"relative_humidity_2m",
			"apparent_temperature",
			"is_day",
			"precipitation",
			"weather_code",
			"wind_speed_10m",
			"wind_direction_10m",
			"uv_index",
		].join(","),
		hourly: [
			"temperature_2m",
			"precipitation_probability",
			"weather_code",
			"is_day",
		].join(","),
		daily: [
			"weather_code",
			"temperature_2m_max",
			"temperature_2m_min",
			"precipitation_sum",
			"precipitation_probability_max",
			"uv_index_max",
		].join(","),
		timezone: "auto",
		forecast_days: "7",
	});

	const url = `${FORECAST_URL}?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(
			"Error al obtener la información meteorológica de Open-Meteo",
		);
	}

	const data = await res.json();
	const current = data.current;
	const hourly = data.hourly;
	const daily = data.daily;

	const esDiaActual = Boolean(current.is_day);
	const condicionActual = interpretarCodigoWMO(
		current.weather_code,
		esDiaActual,
	);

	// Procesar próximas 24 horas a partir del momento actual
	const ahoraIso = current.time;
	const indiceHoraActual = Math.max(
		0,
		hourly.time.findIndex((t: string) => t >= ahoraIso),
	);
	const proximasHoras: PronosticoHora[] = hourly.time
		.slice(indiceHoraActual, indiceHoraActual + 24)
		.map((timeStr: string, i: number) => {
			const idx = indiceHoraActual + i;
			const horaDate = new Date(timeStr);
			const horaLegible = horaDate.toLocaleTimeString("es-CO", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
			const isDay = Boolean(hourly.is_day?.[idx] ?? 1);
			const code = hourly.weather_code[idx];
			return {
				hora: i === 0 ? "Ahora" : horaLegible,
				fechaIso: timeStr,
				temperatura: Math.round(hourly.temperature_2m[idx]),
				probabilidadPrecipitacion: hourly.precipitation_probability?.[idx] ?? 0,
				codigoClima: code,
				esDia: isDay,
				condicion: interpretarCodigoWMO(code, isDay),
			};
		});

	// Procesar pronóstico diario (7 días)
	const diasSemanales: PronosticoDia[] = daily.time.map(
		(fechaStr: string, idx: number) => {
			// Añadimos hora para evitar problemas con desfase de zona horaria local
			const fechaDate = new Date(`${fechaStr}T12:00:00`);
			const fechaLegible =
				idx === 0
					? "Hoy"
					: idx === 1
						? "Mañana"
						: fechaDate.toLocaleDateString("es-CO", {
								weekday: "short",
								day: "numeric",
							});

			const code = daily.weather_code[idx];
			return {
				fecha: fechaLegible.charAt(0).toUpperCase() + fechaLegible.slice(1),
				fechaIso: fechaStr,
				tempMax: Math.round(daily.temperature_2m_max[idx]),
				tempMin: Math.round(daily.temperature_2m_min[idx]),
				probabilidadPrecipitacionMax:
					daily.precipitation_probability_max?.[idx] ?? 0,
				precipitacionSuma: daily.precipitation_sum?.[idx] ?? 0,
				codigoClima: code,
				indiceUvMax: daily.uv_index_max?.[idx] ?? 0,
				condicion: interpretarCodigoWMO(code, true),
			};
		},
	);

	return {
		ubicacion: ubicacionInfo ?? {
			id: 0,
			name: "Ubicación seleccionada",
			latitude: lat,
			longitude: lon,
		},
		actual: {
			temperatura: Math.round(current.temperature_2m),
			sensacionTermica: Math.round(
				current.apparent_temperature ?? current.temperature_2m,
			),
			humedadRelativa: current.relative_humidity_2m,
			velocidadViento: Math.round(current.wind_speed_10m),
			direccionViento: current.wind_direction_10m,
			codigoClima: current.weather_code,
			esDia: esDiaActual,
			precipitacion: current.precipitation ?? 0,
			indiceUv: current.uv_index,
			tiempo: current.time,
			condicion: condicionActual,
		},
		porHoras: proximasHoras,
		porDias: diasSemanales,
		ultimaActualizacion: new Date(),
	};
}

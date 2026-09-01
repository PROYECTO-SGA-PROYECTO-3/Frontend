import type { CondicionClimatica } from "@/types/weather.types";

/**
 * Traduce el código de la Organización Meteorológica Mundial (WMO) a estado legible,
 * colores y diseño temático.
 */
export function interpretarCodigoWMO(
	codigo: number,
	esDia = true,
): CondicionClimatica {
	switch (codigo) {
		case 0:
			return {
				codigo,
				descripcion: esDia ? "Cielo despejado" : "Noche despejada",
				icono: esDia ? "Sun" : "Moon",
				fondoGradiente: esDia
					? "from-amber-400 via-orange-400 to-amber-500"
					: "from-slate-800 via-indigo-950 to-slate-900",
				colorTexto: "text-white",
				esDia,
			};
		case 1:
			return {
				codigo,
				descripcion: esDia ? "Mayormente despejado" : "Noche con pocas nubes",
				icono: esDia ? "SunMedium" : "MoonStar",
				fondoGradiente: esDia
					? "from-sky-400 via-amber-300 to-blue-500"
					: "from-slate-800 via-slate-900 to-indigo-950",
				colorTexto: "text-white",
				esDia,
			};
		case 2:
			return {
				codigo,
				descripcion: "Parcialmente nublado",
				icono: esDia ? "CloudSun" : "CloudMoon",
				fondoGradiente: esDia
					? "from-sky-400 via-blue-400 to-slate-500"
					: "from-slate-800 via-slate-900 to-slate-950",
				colorTexto: "text-white",
				esDia,
			};
		case 3:
			return {
				codigo,
				descripcion: "Nublado / Cubierto",
				icono: "Cloud",
				fondoGradiente: "from-slate-500 via-slate-600 to-slate-700",
				colorTexto: "text-white",
				esDia,
			};
		case 45:
		case 48:
			return {
				codigo,
				descripcion: "Niebla / Neblina",
				icono: "CloudFog",
				fondoGradiente: "from-zinc-400 via-slate-500 to-slate-600",
				colorTexto: "text-white",
				esDia,
			};
		case 51:
		case 53:
		case 55:
			return {
				codigo,
				descripcion: "Llovizna leve",
				icono: "CloudDrizzle",
				fondoGradiente: "from-blue-500 via-cyan-600 to-slate-600",
				colorTexto: "text-white",
				esDia,
			};
		case 61:
			return {
				codigo,
				descripcion: "Lluvia ligera",
				icono: "CloudRain",
				fondoGradiente: "from-blue-500 via-indigo-600 to-slate-700",
				colorTexto: "text-white",
				esDia,
			};
		case 63:
		case 65:
			return {
				codigo,
				descripcion: "Lluvia moderada o intensa",
				icono: "CloudRain",
				fondoGradiente: "from-blue-600 via-indigo-700 to-slate-800",
				colorTexto: "text-white",
				esDia,
			};
		case 71:
		case 73:
		case 75:
		case 77:
			return {
				codigo,
				descripcion: "Nieve / Granizo",
				icono: "CloudSnow",
				fondoGradiente: "from-indigo-300 via-sky-400 to-slate-600",
				colorTexto: "text-slate-900",
				esDia,
			};
		case 80:
		case 81:
		case 82:
			return {
				codigo,
				descripcion: "Chubascos de lluvia",
				icono: "CloudRain",
				fondoGradiente: "from-cyan-600 via-blue-700 to-slate-800",
				colorTexto: "text-white",
				esDia,
			};
		case 95:
		case 96:
		case 99:
			return {
				codigo,
				descripcion: "Tormenta eléctrica",
				icono: "CloudLightning",
				fondoGradiente: "from-purple-700 via-slate-800 to-slate-900",
				colorTexto: "text-white",
				esDia,
			};
		default:
			return {
				codigo,
				descripcion: "Tiempo variable",
				icono: "CloudSun",
				fondoGradiente: "from-emerald-500 via-teal-600 to-slate-700",
				colorTexto: "text-white",
				esDia,
			};
	}
}

export interface UbicacionGeo {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation?: number;
	country?: string;
	country_code?: string;
	admin1?: string; // Departamento / Estado / Provincia
	admin2?: string;
	timezone?: string;
}

export interface CondicionClimatica {
	codigo: number;
	descripcion: string;
	icono: string; // Nombre o descriptor de icono
	fondoGradiente: string;
	colorTexto: string;
	esDia: boolean;
}

export interface ClimaActual {
	temperatura: number;
	sensacionTermica: number;
	humedadRelativa: number;
	velocidadViento: number;
	direccionViento: number;
	codigoClima: number;
	esDia: boolean;
	precipitacion: number;
	indiceUv?: number;
	tiempo: string;
	condicion: CondicionClimatica;
}

export interface PronosticoHora {
	hora: string; // Formato legible ej: "14:00"
	fechaIso: string;
	temperatura: number;
	probabilidadPrecipitacion: number;
	codigoClima: number;
	esDia: boolean;
	condicion: CondicionClimatica;
}

export interface PronosticoDia {
	fecha: string; // Formato legible ej: "Lun 12"
	fechaIso: string;
	tempMax: number;
	tempMin: number;
	probabilidadPrecipitacionMax: number;
	precipitacionSuma: number;
	codigoClima: number;
	indiceUvMax: number;
	condicion: CondicionClimatica;
}

export interface DatosClimaCompletos {
	ubicacion: UbicacionGeo;
	actual: ClimaActual;
	porHoras: PronosticoHora[];
	porDias: PronosticoDia[];
	ultimaActualizacion: Date;
}

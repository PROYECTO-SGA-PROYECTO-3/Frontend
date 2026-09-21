import type { CondicionClimatica } from '@/shared/types/weather.types'

/**
 * Traduce el código de la Organización Meteorológica Mundial (WMO) a estado legible
 * y asocia el icono estandarizado de Lucide.
 */
export function interpretarCodigoWMO(codigo: number, esDia = true): CondicionClimatica {
  switch (codigo) {
    case 0:
      return {
        codigo,
        descripcion: esDia ? 'Cielo despejado' : 'Noche despejada',
        icono: esDia ? 'Sun' : 'Moon',
        esDia,
      }
    case 1:
      return {
        codigo,
        descripcion: esDia ? 'Mayormente despejado' : 'Noche con pocas nubes',
        icono: esDia ? 'SunMedium' : 'MoonStar',
        esDia,
      }
    case 2:
      return {
        codigo,
        descripcion: 'Parcialmente nublado',
        icono: esDia ? 'CloudSun' : 'CloudMoon',
        esDia,
      }
    case 3:
      return {
        codigo,
        descripcion: 'Nublado',
        icono: 'Cloud',
        esDia,
      }
    case 45:
    case 48:
      return {
        codigo,
        descripcion: 'Niebla / Neblina',
        icono: 'CloudFog',
        esDia,
      }
    case 51:
    case 53:
    case 55:
      return {
        codigo,
        descripcion: 'Llovizna',
        icono: 'CloudDrizzle',
        esDia,
      }
    case 61:
      return {
        codigo,
        descripcion: 'Lluvia ligera',
        icono: 'CloudRain',
        esDia,
      }
    case 63:
    case 65:
      return {
        codigo,
        descripcion: 'Lluvia moderada o fuerte',
        icono: 'CloudRain',
        esDia,
      }
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        codigo,
        descripcion: 'Nieve / Granizo',
        icono: 'CloudSnow',
        esDia,
      }
    case 80:
    case 81:
    case 82:
      return {
        codigo,
        descripcion: 'Chubascos',
        icono: 'CloudRain',
        esDia,
      }
    case 95:
    case 96:
    case 99:
      return {
        codigo,
        descripcion: 'Tormenta eléctrica',
        icono: 'CloudLightning',
        esDia,
      }
    default:
      return {
        codigo,
        descripcion: 'Tiempo variable',
        icono: esDia ? 'CloudSun' : 'CloudMoon',
        esDia,
      }
  }
}

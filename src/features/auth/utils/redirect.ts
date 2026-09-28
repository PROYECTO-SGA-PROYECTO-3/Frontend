import type { Rol } from '../types'

export const RUTAS_POR_ROL: Record<Rol, string> = {
  ADMIN: '/admin',
  DOCENTE: '/docente',
  ESTUDIANTE: '/estudiante',
}

const esRutaInsegura = (url: string) => !url.startsWith('/') || url.startsWith('//')
const esBucle = (url: string) => url.startsWith('/login') || url.startsWith('/no-autorizado')
const esRolIncompatible = (url: string, rol: Rol) =>
  (url.startsWith('/admin') && rol !== 'ADMIN') ||
  (url.startsWith('/docente') && rol !== 'DOCENTE') ||
  (url.startsWith('/estudiante') && rol !== 'ESTUDIANTE')

export function resolverRutaDestino(redirectParam: string | null, rol: Rol): string {
  if (!redirectParam) return RUTAS_POR_ROL[rol]

  const debeRechazar =
    esRutaInsegura(redirectParam) ||
    esBucle(redirectParam) ||
    esRolIncompatible(redirectParam, rol)

  return debeRechazar ? RUTAS_POR_ROL[rol] : redirectParam
}
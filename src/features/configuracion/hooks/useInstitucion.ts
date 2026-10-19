import { useQuery } from '@tanstack/react-query'
import { obtenerInstitucion } from '../api/institucionApi'
import { extraerMensajeError } from '@/shared/lib'

export const QUERY_KEY_INSTITUCION = ['institucion'] as const

export function useInstitucion() {
  return useQuery({
    queryKey: QUERY_KEY_INSTITUCION,
    queryFn: async () => {
      try {
        return await obtenerInstitucion()
      } catch (err: unknown) {
        // Un 404 es esperado si aún no se ha creado una configuración institucional
        const mensaje = extraerMensajeError(err)
        if (
          mensaje.includes('No se encontró') ||
          (err as { response?: { status?: number } })?.response?.status === 404
        ) {
          return null
        }
        throw err
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

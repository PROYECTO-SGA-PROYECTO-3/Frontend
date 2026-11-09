import { useQuery } from '@tanstack/react-query'
import { extraerMensajeError } from '@/shared/lib'
import { obtenerResumenDocentes } from '../api/docentesApi'
import { DOCENTES_QUERY_KEYS } from './queryKeys'
import type { ResumenDocentes } from '../types'

/**
 * Hook responsable exclusivamente de consultar los conteos agregados de la
 * planta docente, que alimentan las tarjetas de métricas del directorio.
 *
 * La clave cuelga de la raíz del módulo, así que activar, desactivar, crear o
 * eliminar un docente la invalida sin que las mutaciones tengan que saber de
 * este hook. Si la consulta falla devuelve `null`: el directorio debe seguir
 * funcionando aunque el resumen no esté disponible.
 */
export function useResumenDocentes() {
  const { data, isLoading, isError, error } = useQuery<ResumenDocentes, Error>({
    queryKey: DOCENTES_QUERY_KEYS.resumen(),
    queryFn: obtenerResumenDocentes,
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
    retry: 1,
  })

  return {
    resumen: data ?? null,
    isLoading,
    isError,
    error: error ? extraerMensajeError(error) : null,
  }
}

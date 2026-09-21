import { useCallback } from 'react'
import type { Asignatura } from '../types'

/**
 * Hook responsable exclusivamente de las reglas de validación en cliente
 * para evitar colisiones o inconsistencias antes del envío al backend.
 */
export function useValidacionMateria(asignaturas: Asignatura[]) {
  const existeNombreDuplicado = useCallback(
    (nombre: string, ignorarId?: number): boolean => {
      const normalizado = nombre.trim().toLowerCase()
      return asignaturas.some(
        (a) => a.id !== ignorarId && a.nombre.trim().toLowerCase() === normalizado,
      )
    },
    [asignaturas],
  )

  return {
    existeNombreDuplicado,
  }
}

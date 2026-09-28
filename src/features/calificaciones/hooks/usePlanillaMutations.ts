import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importarNotas } from '../api/notasApi'
import { NOTAS_PLANILLA_KEY } from './useNotasPlanilla'
import type { ResultadoImportacionNotas } from '../types'

interface ParametrosImportacion {
  cargaAcademicaId: number
  periodoId: number
  archivo: File
}

export function usePlanillaMutations() {
  const queryClient = useQueryClient()

  const mutacionImportar = useMutation<
    ResultadoImportacionNotas,
    unknown,
    ParametrosImportacion
  >({
    mutationFn: ({ cargaAcademicaId, periodoId, archivo }) =>
      importarNotas(cargaAcademicaId, periodoId, archivo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [NOTAS_PLANILLA_KEY, variables.cargaAcademicaId, variables.periodoId],
      })
    },
  })

  return {
    importar: mutacionImportar.mutateAsync,
    estaImportando: mutacionImportar.isPending,
    errorImportacion: mutacionImportar.error,
    resultadoImportacion: mutacionImportar.data ?? null,
    resetearImportacion: mutacionImportar.reset,
  }
}

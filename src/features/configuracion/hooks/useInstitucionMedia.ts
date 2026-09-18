import { useState, type ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subirLogoInstitucion,
  subirSelloInstitucion,
  subirFirmaRector,
  subirBanderaInstitucion,
} from '../api/institucionApi'
import { extraerMensajeError } from '@/shared/lib/axios'
import type { Institucion } from '../types'

export type TipoMediaInstitucional = 'logo' | 'sello' | 'firma' | 'bandera'

export interface ItemMediaInfo {
  tipo: TipoMediaInstitucional
  titulo: string
  descripcion: string
  urlActual: string | null | undefined
}

export function useInstitucionMedia(institucion: Institucion | null) {
  const queryClient = useQueryClient()
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)
  const [tipoEnProceso, setTipoEnProceso] = useState<TipoMediaInstitucional | null>(null)

  const mutacionSubida = useMutation({
    mutationFn: async ({ archivo, tipo }: { archivo: File; tipo: TipoMediaInstitucional }) => {
      setTipoEnProceso(tipo)
      setErrorGlobal(null)
      if (tipo === 'logo') return subirLogoInstitucion(archivo)
      if (tipo === 'sello') return subirSelloInstitucion(archivo)
      if (tipo === 'firma') return subirFirmaRector(archivo)
      return subirBanderaInstitucion(archivo)
    },
    onSuccess: (dataActualizada) => {
      queryClient.setQueryData(['institucion'], dataActualizada)
      queryClient.invalidateQueries({ queryKey: ['institucion'] })
      setTipoEnProceso(null)
    },
    onError: (error) => {
      setErrorGlobal(extraerMensajeError(error))
      setTipoEnProceso(null)
    },
  })

  const manejarSubidaArchivo = (e: ChangeEvent<HTMLInputElement>, tipo: TipoMediaInstitucional) => {
    const archivos = e.target.files
    if (!archivos || archivos.length === 0) return
    const archivo = archivos[0]

    // Máximo 3 MB
    if (archivo.size > 3 * 1024 * 1024) {
      setErrorGlobal('El archivo no debe superar los 3 MB.')
      e.target.value = ''
      return
    }

    mutacionSubida.mutate({ archivo, tipo })
    e.target.value = ''
  }

  const itemsMedia: ItemMediaInfo[] = [
    {
      tipo: 'logo',
      titulo: 'Logotipo Escolar',
      descripcion: 'Encabezados y membretes oficiales',
      urlActual: institucion?.logoUrl,
    },
    {
      tipo: 'sello',
      titulo: 'Sello Institucional',
      descripcion: 'Constancias, certificados y sellos',
      urlActual: institucion?.selloUrl,
    },
    {
      tipo: 'firma',
      titulo: 'Firma del Rector',
      descripcion: 'Firma digital en boletines de notas',
      urlActual: institucion?.firmaRectorUrl,
    },
    {
      tipo: 'bandera',
      titulo: 'Bandera / Emblema',
      descripcion: 'Símbolos institucionales',
      urlActual: institucion?.banderaUrl,
    },
  ]

  return {
    itemsMedia,
    tipoEnProceso,
    errorGlobal,
    isPending: mutacionSubida.isPending,
    manejarSubidaArchivo,
  }
}

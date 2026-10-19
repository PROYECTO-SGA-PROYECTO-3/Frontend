import { useState, type ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subirLogoInstitucion,
  subirSelloInstitucion,
  subirFirmaRector,
  subirBanderaInstitucion,
} from '../api/institucionApi'
import { extraerMensajeError } from '@/shared/lib'
import type { Institucion } from '../types'

export type TipoMediaInstitucional = 'logo' | 'sello' | 'firma' | 'bandera'

export interface ItemMediaInfo {
  tipo: TipoMediaInstitucional
  titulo: string
  descripcion: string
  urlActual: string | null | undefined
}

const MENSAJES_EXITO: Record<TipoMediaInstitucional, string> = {
  logo: 'Logotipo escolar actualizado con éxito.',
  sello: 'Sello institucional actualizado con éxito.',
  firma: 'Firma del rector actualizada con éxito.',
  bandera: 'Bandera o emblema institucional actualizado con éxito.',
}

export function useInstitucionMedia(institucion: Institucion | null) {
  const queryClient = useQueryClient()
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
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
    onSuccess: (dataActualizada, variables) => {
      setMensajeExito(MENSAJES_EXITO[variables.tipo])
      setErrorGlobal(null)
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

    setMensajeExito(null)
    mutacionSubida.mutate({ archivo, tipo })
    e.target.value = ''
  }

  const limpiarMensajeExito = () => {
    setMensajeExito(null)
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
    mensajeExito,
    limpiarMensajeExito,
    isPending: mutacionSubida.isPending,
    manejarSubidaArchivo,
  }
}

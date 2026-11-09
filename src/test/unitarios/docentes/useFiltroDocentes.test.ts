import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFiltroDocentes } from '@/features/docentes/hooks/useFiltroDocentes'
import { crearDocenteMock } from '@/test/utils/fixtures'

describe('Búsqueda y Filtrado del Directorio de Docentes', () => {
  // Planta docente de prueba: cada docente difiere en estado, firma y materias
  // para que cada filtro tenga un único resultado esperado.
  const planta = [
    crearDocenteMock({
      id: 1,
      primerNombre: 'Carlos',
      primerApellido: 'Gomez',
      documento: '1000000001',
      email: 'carlos.gomez@iedescanse.edu.co',
      materias: ['Matemáticas'],
      activo: true,
      firmaUrl: 'https://servidor.test/firmas/carlos.png',
    }),
    crearDocenteMock({
      id: 2,
      primerNombre: 'Ana',
      primerApellido: 'Martinez',
      documento: '900000002',
      email: 'ana.martinez@iedescanse.edu.co',
      materias: ['Biología', 'Química'],
      activo: true,
      firmaUrl: null,
    }),
    crearDocenteMock({
      id: 3,
      primerNombre: 'Zulma',
      primerApellido: 'Pena',
      documento: '1000000003',
      email: 'zulma.pena@iedescanse.edu.co',
      materias: ['Sociales'],
      activo: false,
      firmaUrl: null,
    }),
  ]

  const nombresDe = (docentes: { primerNombre: string }[]) =>
    docentes.map((docente) => docente.primerNombre)

  it('localiza al docente por cualquiera de sus datos: nombre, documento, correo o materia', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    act(() => result.current.setBusqueda('gomez'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Carlos'])

    act(() => result.current.setBusqueda('900000002'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana'])

    act(() => result.current.setBusqueda('zulma.pena@iedescanse.edu.co'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Zulma'])

    act(() => result.current.setBusqueda('química'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana'])
  })

  it('separa la planta por estado de habilitación', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    act(() => result.current.setFiltroEstado('ACTIVOS'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana', 'Carlos'])

    act(() => result.current.setFiltroEstado('INACTIVOS'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Zulma'])
  })

  it('separa a quienes ya tienen firma digital de quienes la tienen pendiente', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    act(() => result.current.setFiltroFirma('CON_FIRMA'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Carlos'])

    act(() => result.current.setFiltroFirma('SIN_FIRMA'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana', 'Zulma'])
  })

  it('ordena por nombre en ambos sentidos y por identificación', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana', 'Carlos', 'Zulma'])

    act(() => result.current.setOrden('NOMBRE_DESC'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Zulma', 'Carlos', 'Ana'])

    act(() => result.current.setOrden('DOCUMENTO_ASC'))
    expect(nombresDe(result.current.docentesFiltrados)).toEqual(['Ana', 'Carlos', 'Zulma'])
  })

  it('señala cuándo hay filtros puestos y los restablece todos de una vez', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    expect(result.current.hayFiltroActivo).toBe(false)

    act(() => result.current.setBusqueda('gomez'))
    act(() => result.current.setFiltroFirma('CON_FIRMA'))
    expect(result.current.hayFiltroActivo).toBe(true)

    act(() => result.current.limpiarFiltros())

    expect(result.current.hayFiltroActivo).toBe(false)
    expect(result.current.busqueda).toBe('')
    expect(result.current.filtroEstado).toBe('TODOS')
    expect(result.current.filtroFirma).toBe('TODOS')
    expect(result.current.orden).toBe('NOMBRE_ASC')
    expect(result.current.docentesFiltrados).toHaveLength(3)
  })

  // `/api/docentes` no acepta término de búsqueda, así que este hook solo puede
  // filtrar la página ya descargada. El test fija ese límite para que nadie
  // presente sus resultados como si cubrieran la planta completa.
  it('alcanza únicamente a los docentes que recibe, no a los de otras páginas', () => {
    const paginaUno = [planta[0], planta[1]]
    const { result } = renderHook(() => useFiltroDocentes(paginaUno))

    act(() => result.current.setBusqueda('zulma'))

    expect(result.current.docentesFiltrados).toEqual([])
  })
})

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

  it('mantiene las estadísticas del encabezado sobre la planta completa, no sobre lo filtrado', () => {
    const { result } = renderHook(() => useFiltroDocentes(planta))

    expect(result.current.totalActivos).toBe(2)
    expect(result.current.totalInactivos).toBe(1)
    expect(result.current.totalConFirma).toBe(1)

    act(() => result.current.setBusqueda('gomez'))

    expect(result.current.totalFiltrados).toBe(1)
    expect(result.current.totalDocentes).toBe(3)
    expect(result.current.totalActivos).toBe(2)
    expect(result.current.totalConFirma).toBe(1)
  })
})

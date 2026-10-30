import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TablaNotasPlanilla } from '@/features/calificaciones/components/TablaNotasPlanilla'
import { crearNotaMock } from '@/test/utils/fixtures'

describe('Planilla de Calificaciones del Curso', () => {
  const notas = [
    crearNotaMock({ id: 1, matriculaId: 101, nombreEstudiante: 'Mariana Lopez', documentoEstudiante: '1098123456', valor: 4.5 }),
    crearNotaMock({ id: 2, matriculaId: 102, nombreEstudiante: 'Sebastian Gomez', documentoEstudiante: '1098654321', valor: null }),
  ]

  it('no muestra la tabla si el curso seleccionado aún no cuenta con estudiantes matriculados', () => {
    const { container } = render(<TablaNotasPlanilla notas={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('muestra la estructura de carga visual mientras se consultan las calificaciones del periodo', () => {
    render(<TablaNotasPlanilla notas={[]} isLoading={true} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
  })

  it('presenta a los alumnos matriculados, distinguiendo entre evaluados y pendientes por calificar', () => {
    render(<TablaNotasPlanilla notas={notas} />)

    expect(screen.getByText('1 de 2 estudiantes con nota registrada')).toBeInTheDocument()
    expect(screen.getByText('Mariana Lopez')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Sebastian Gomez')).toBeInTheDocument()
    expect(screen.getByText('Sin calificar')).toBeInTheDocument()
  })
})

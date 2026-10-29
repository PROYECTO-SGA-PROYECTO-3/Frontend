import type { Usuario, Rol } from '@/features/auth/types'
import type { Nota } from '@/features/calificaciones/types'

export function crearUsuarioMock(parcial: Partial<Usuario> = {}): Usuario {
  return {
    documento: '1098765432',
    email: 'usuario.test@iedescanse.edu.co',
    primerNombre: 'Carlos',
    segundoNombre: 'Alberto',
    primerApellido: 'Gomez',
    segundoApellido: 'Restrepo',
    rol: 'ADMIN',
    ...parcial,
  }
}

export function crearUsuarioConRol(rol: Rol): Usuario {
  return crearUsuarioMock({ rol })
}

export function crearNotaMock(parcial: Partial<Nota> = {}): Nota {
  return {
    id: 1,
    matriculaId: 101,
    documentoEstudiante: '1098123456',
    nombreEstudiante: 'Mariana Lopez',
    cargaAcademicaId: 10,
    nombreAsignatura: 'Matemáticas',
    periodoId: 1,
    nombrePeriodo: 'Primer Periodo',
    valor: 4.5,
    habilitadaParaEdicion: true,
    ...parcial,
  }
}

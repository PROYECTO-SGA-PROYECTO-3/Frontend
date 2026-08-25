import { clsx, type ClassValue } from 'clsx'

/** Combina clases de Tailwind con lógica condicional */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

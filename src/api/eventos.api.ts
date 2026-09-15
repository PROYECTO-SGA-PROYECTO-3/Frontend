import { api } from "./axios";
import type { EventoInstitucional, SolicitudCrearEvento } from "@/types/eventos.types";

export function listarEventos(): Promise<EventoInstitucional[]> {
  return api.get<EventoInstitucional[]>("/eventos");
}

export function crearEvento(datos: SolicitudCrearEvento): Promise<EventoInstitucional> {
  return api.post<EventoInstitucional>("/eventos", datos);
}

export function eliminarEvento(id: number): Promise<void> {
  return api.delete<void>(`/eventos/${id}`);
}

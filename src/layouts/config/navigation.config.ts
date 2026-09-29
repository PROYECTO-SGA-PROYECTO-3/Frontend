import {
	BookMarked,
	Calendar,
	ClipboardList,
	FileText,
	GraduationCap,
	Home,
	LayoutDashboard,
	Settings,
	Users,
	type LucideIcon,
} from "lucide-react";
import type { Rol } from "@/features/auth";

export interface ItemNav {
	etiqueta: string;
	ruta: string;
	icono: LucideIcon;
}

export const ITEMS_NAV_PRINCIPAL: Record<Rol, ItemNav[]> = {
	ADMIN: [
		{ etiqueta: "Dashboard", ruta: "/admin", icono: LayoutDashboard },
		{ etiqueta: "Docentes", ruta: "/admin/docentes", icono: Users },
		{ etiqueta: "Estudiantes", ruta: "/admin/estudiantes", icono: GraduationCap },
		{ etiqueta: "Materias", ruta: "/admin/materias", icono: BookMarked },
		{ etiqueta: "Calendario", ruta: "/admin/calendario", icono: Calendar },
	],
	DOCENTE: [
		{ etiqueta: "Inicio", ruta: "/docente", icono: LayoutDashboard },
		{
			etiqueta: "Planilla de Calificaciones",
			ruta: "/docente/planilla",
			icono: ClipboardList,
		},
		{ etiqueta: "Calendario", ruta: "/docente/calendario", icono: Calendar },
	],
	ESTUDIANTE: [
		{ etiqueta: "Inicio", ruta: "/estudiante", icono: Home },
		{
			etiqueta: "Calificaciones",
			ruta: "/estudiante/calificaciones",
			icono: FileText,
		},
		{ etiqueta: "Calendario", ruta: "/estudiante/calendario", icono: Calendar },
	],
};

export const ITEMS_NAV_SECUNDARIO: Record<Rol, ItemNav[]> = {
	ADMIN: [
		{ etiqueta: "Configuración", ruta: "/admin/configuracion", icono: Settings },
	],
	DOCENTE: [],
	ESTUDIANTE: [],
};

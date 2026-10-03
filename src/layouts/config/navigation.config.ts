import {
	BookMarked,
	ClipboardList,
	FileText,
	GraduationCap,
	Home,
	LayoutDashboard,
	School,
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
		{ etiqueta: "Cursos", ruta: "/admin/cursos", icono: School },
		{ etiqueta: "Docentes", ruta: "/admin/docentes", icono: Users },
		{ etiqueta: "Estudiantes", ruta: "/admin/estudiantes", icono: GraduationCap },
		{ etiqueta: "Materias", ruta: "/admin/materias", icono: BookMarked },
	],
	DOCENTE: [
		{ etiqueta: "Inicio", ruta: "/docente", icono: LayoutDashboard },
		{
			etiqueta: "Planilla de Calificaciones",
			ruta: "/docente/planilla",
			icono: ClipboardList,
		},
	],
	ESTUDIANTE: [
		{ etiqueta: "Inicio", ruta: "/estudiante", icono: Home },
		{
			etiqueta: "Calificaciones",
			ruta: "/estudiante/calificaciones",
			icono: FileText,
		},
	],
};

export const ITEMS_NAV_SECUNDARIO: Record<Rol, ItemNav[]> = {
	ADMIN: [
		{ etiqueta: "Configuración", ruta: "/admin/configuracion", icono: Settings },
	],
	DOCENTE: [],
	ESTUDIANTE: [],
};

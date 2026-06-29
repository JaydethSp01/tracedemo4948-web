export type EstadoSocio = "activo" | "inactivo" | "suspendido";
export type EstadoMembresia = "activa" | "vencida" | "cancelada" | "pendiente";
export type TipoClase = "yoga" | "spinning" | "crossfit" | "pilates" | "zumba" | "boxeo" | "natacion";
export type DiaSemana = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

export interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionDias: number;
  beneficios: string[];
  activo: boolean;
  creadoEn: string;
}

export interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  estado: EstadoSocio;
  avatarUrl?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Membresia {
  id: string;
  socioId: string;
  planId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoMembresia;
  montoPagado: number;
  metodoPago: "efectivo" | "tarjeta" | "transferencia";
  observaciones?: string;
  creadoEn: string;
}

export interface Clase {
  id: string;
  nombre: string;
  tipo: TipoClase;
  instructorNombre: string;
  instructorEmail: string;
  dias: DiaSemana[];
  horaInicio: string;
  horaFin: string;
  capacidadMaxima: number;
  inscriptos: number;
  sala: string;
  descripcion: string;
  activa: boolean;
  creadoEn: string;
}

export const planes: Plan[] = [
  {
    id: "plan-001",
    nombre: "Básico",
    descripcion: "Acceso a sala de musculación en horario estándar",
    precio: 8500,
    duracionDias: 30,
    beneficios: ["Sala de musculación", "Vestuarios", "Casillero"],
    activo: true,
    creadoEn: "2024-01-10T09:00:00Z",
  },
  {
    id: "plan-002",
    nombre: "Estándar",
    descripcion: "Acceso completo + 2 clases grupales por semana",
    precio: 12000,
    duracionDias: 30,
    beneficios: ["Sala de musculación", "2 clases grupales/semana", "Vestuarios", "Casillero", "Toalla incluida"],
    activo: true,
    creadoEn: "2024-01-10T09:00:00Z",
  },
  {
    id: "plan-003",
    nombre: "Premium",
    descripcion: "Acceso ilimitado a todas las instalaciones y clases",
    precio: 18500,
    duracionDias: 30,
    beneficios: [
      "Sala de musculación 24hs",
      "Clases grupales ilimitadas",
      "Acceso a spa y sauna",
      "Evaluación física mensual",
      "Toalla incluida",
      "Estacionamiento",
    ],
    activo: true,
    creadoEn: "2024-01-10T09:00:00Z",
  },
  {
    id: "plan-004",
    nombre: "Trimestral Premium",
    descripcion: "Plan Premium con descuento por pago anticipado trimestral",
    precio: 49000,
    duracionDias: 90,
    beneficios: [
      "Sala de musculación 24hs",
      "Clases grupales ilimitadas",
      "Acceso a spa y sauna",
      "Evaluación física mensual",
      "Toalla incluida",
      "Estacionamiento",
      "Descuento 12%",
    ],
    activo: true,
    creadoEn: "2024-02-01T09:00:00Z",
  },
  {
    id: "plan-005",
    nombre: "Anual Básico",
    descripcion: "Plan Básico con el mejor precio por pago anual",
    precio: 85000,
    duracionDias: 365,
    beneficios: ["Sala de musculación", "Vestuarios", "Casillero", "Descuento 17%"],
    activo: true,
    creadoEn: "2024-02-01T09:00:00Z",
  },
  {
    id: "plan-006",
    nombre: "Estudiantil",
    descripcion: "Plan especial para estudiantes con credencial vigente",
    precio: 6500,
    duracionDias: 30,
    beneficios: ["Sala de musculación horario reducido", "1 clase grupal/semana", "Vestuarios"],
    activo: false,
    creadoEn: "2024-03-15T09:00:00Z",
  },
];

export const socios: Socio[] = [
  {
    id: "socio-001",
    nombre: "Martina",
    apellido: "González",
    email: "martina.gonzalez@gmail.com",
    telefono: "+54 9 11 2345-6789",
    dni: "38.291.447",
    fechaNacimiento: "1995-07-14",
    direccion: "Av. Corrientes 1842, CABA",
    estado: "activo",
    creadoEn: "2024-03-01T10:00:00Z",
    actualizadoEn: "2026-05-20T14:30:00Z",
  },
  {
    id: "socio-002",
    nombre: "Lucas",
    apellido: "Ramírez",
    email: "lucas.ramirez@hotmail.com",
    telefono: "+54 9 11 9876-5432",
    dni: "41.003.892",
    fechaNacimiento: "1999-11-28",
    direccion: "Calle Lavalle 567, Palermo, CABA",
    estado: "activo",
    creadoEn: "2024-04-15T11:30:00Z",
    actualizadoEn: "2026-06-01T09:00:00Z",
  },
  {
    id: "socio-003",
    nombre: "Valentina",
    apellido: "Torres",
    email: "valen.torres@outlook.com",
    telefono: "+54 9 11 5544-3322",
    dni: "36.874.115",
    fechaNacimiento: "1992-03-19",
    direccion: "Av. Santa Fe 3210, Recoleta, CABA",
    estado: "activo",
    creadoEn: "2024-05-20T09:15:00Z",
    actualizadoEn: "2026-06-10T16:00:00Z",
  },
  {
    id: "socio-004",
    nombre: "Sebastián",
    apellido: "Morales",
    email: "sebas.morales@gmail.com",
    telefono: "+54 9 11 7788-9900",
    dni: "33.456.789",
    fechaNacimiento: "1988-09-05",
    direccion: "Humboldt 1420, Villa Crespo, CABA",
    estado: "suspendido",
    creadoEn: "2024-01-20T08:00:00Z",
    actualizadoEn: "2026-04-15T10:00:00Z",
  },
  {
    id: "socio-005",
    nombre: "Camila",
    apellido: "Fernández",
    email: "cami.fernandez@gmail.com",
    telefono: "+54 9 11 6655-4433",
    dni: "43.112.667",
    fechaNacimiento: "2001-01-30",
    direccion: "Av. Cabildo 2800, Belgrano, CABA",
    estado: "activo",
    creadoEn: "2025-01-10T14:00:00Z",
    actualizadoEn: "2026-06-15T11:30:00Z",
  },
  {
    id: "socio-006",
    nombre: "Nicolás",
    apellido: "Herrera",
    email: "nico.herrera@yahoo.com",
    telefono: "+54 9 11 3344-5566",
    dni: "37.598.002",
    fechaNacimiento: "1993-06-12",
    direccion: "Thames 822, Palermo Soho, CABA",
    estado: "inactivo",
    creadoEn: "2023-11-05T10:30:00Z",
    actualizadoEn: "2026-03-01T09:00:00Z",
  },
  {
    id: "socio-007",
    nombre: "Florencia",
    apellido: "López",
    email: "flor.lopez@gmail.com",
    telefono: "+54 9 11 8899-0011",
    dni: "39.774.330",
    fechaNacimiento: "1997-04-22",
    direccion: "Gurruchaga 1560, Palermo, CABA",
    estado: "activo",
    creadoEn: "2025-02-28T15:00:00Z",
    actualizadoEn: "2026-06-20T08:45:00Z",
  },
  {
    id: "socio-008",
    nombre: "Diego",
    apellido: "Acosta",
    email: "diego.acosta@gmail.com",
    telefono: "+54 9 11 2211-3344",
    dni: "35.129.874",
    fechaNacimiento: "1990-12-08",
    direccion: "Av. del Libertador 4500, Núñez, CABA",
    estado: "activo",
    creadoEn: "2024-08-01T12:00:00Z",
    actualizadoEn: "2026-06-25T10:15:00Z",
  },
];

export const membresias: Membresia[] = [
  {
    id: "mem-001",
    socioId: "socio-001",
    planId: "plan-003",
    fechaInicio: "2026-06-01",
    fechaFin: "2026-06-30",
    estado: "activa",
    montoPagado: 18500,
    metodoPago: "tarjeta",
    observaciones: "Renovación automática aprobada",
    creadoEn: "2026-06-01T10:05:00Z",
  },
  {
    id: "mem-002",
    socioId: "socio-002",
    planId: "plan-002",
    fechaInicio: "2026-06-15",
    fechaFin: "2026-07-15",
    estado: "activa",
    montoPagado: 12000,
    metodoPago: "efectivo",
    creadoEn: "2026-06-15T11:30:00Z",
  },
  {
    id: "mem-003",
    socioId: "socio-003",
    planId: "plan-004",
    fechaInicio: "2026-05-01",
    fechaFin: "2026-07-31",
    estado: "activa",
    montoPagado: 49000,
    metodoPago: "transferencia",
    observaciones: "Pagó el trimestre completo por adelantado",
    creadoEn: "2026-05-01T09:20:00Z",
  },
  {
    id: "mem-004",
    socioId: "socio-004",
    planId: "plan-001",
    fechaInicio: "2026-03-01",
    fechaFin: "2026-03-31",
    estado: "vencida",
    montoPagado: 8500,
    metodoPago: "efectivo",
    observaciones: "Socio suspendido por deuda pendiente",
    creadoEn: "2026-03-01T08:00:00Z",
  },
  {
    id: "mem-005",
    socioId: "socio-005",
    planId: "plan-002",
    fechaInicio: "2026-06-10",
    fechaFin: "2026-07-10",
    estado: "activa",
    montoPagado: 12000,
    metodoPago: "tarjeta",
    creadoEn: "2026-06-10T14:10:00Z",
  },
  {
    id: "mem-006",
    socioId: "socio-006",
    planId: "plan-001",
    fechaInicio: "2026-02-01",
    fechaFin: "2026-02-28",
    estado: "cancelada",
    montoPagado: 8500,
    metodoPago: "tarjeta",
    observaciones: "Cancelada a pedido del socio por mudanza",
    creadoEn: "2026-02-01T10:00:00Z",
  },
  {
    id: "mem-007",
    socioId: "socio-007",
    planId: "plan-003",
    fechaInicio: "2026-06-20",
    fechaFin: "2026-07-20",
    estado: "activa",
    montoPagado: 18500,
    metodoPago: "transferencia",
    creadoEn: "2026-06-20T15:05:00Z",
  },
  {
    id: "mem-008",
    socioId: "socio-008",
    planId: "plan-005",
    fechaInicio: "2026-01-01",
    fechaFin: "2026-12-31",
    estado: "activa",
    montoPagado: 85000,
    metodoPago: "transferencia",
    observaciones: "Plan anual con descuento por antigüedad",
    creadoEn: "2026-01-01T12:00:00Z",
  },
];

export const clases: Clase[] = [
  {
    id: "clase-001",
    nombre: "Yoga Relax",
    tipo: "yoga",
    instructorNombre: "Andrea Suárez",
    instructorEmail: "andrea.suarez@gymfit.com",
    dias: ["lunes", "miercoles", "viernes"],
    horaInicio: "08:00",
    horaFin: "09:00",
    capacidadMaxima: 15,
    inscriptos: 12,
    sala: "Sala Zen – Piso 2",
    descripcion: "Clase de yoga orientada a la relajación y flexibilidad. Apta para todos los niveles.",
    activa: true,
    creadoEn: "2024-01-15T09:00:00Z",
  },
  {
    id: "clase-002",
    nombre: "Spinning Power",
    tipo: "spinning",
    instructorNombre: "Roberto Cáceres",
    instructorEmail: "roberto.caceres@gymfit.com",
    dias: ["martes", "jueves", "sabado"],
    horaInicio: "07:00",
    horaFin: "08:00",
    capacidadMaxima: 20,
    inscriptos: 20,
    sala: "Sala Spinning – Piso 1",
    descripcion: "Ciclismo de alta intensidad con música motivacional. Quema hasta 700 kcal por sesión.",
    activa: true,
    creadoEn: "2024-01-15T09:00:00Z",
  },
  {
    id: "clase-003",
    nombre: "CrossFit Funcional",
    tipo: "crossfit",
    instructorNombre: "Maximiliano Ríos",
    instructorEmail: "maxi.rios@gymfit.com",
    dias: ["lunes", "miercoles", "viernes"],
    horaInicio: "19:00",
    horaFin: "20:15",
    capacidadMaxima: 12,
    inscriptos: 9,
    sala: "Sala CrossFit – Piso 1",
    descripcion: "Entrenamiento funcional de alta intensidad combinando fuerza, resistencia y agilidad.",
    activa: true,
    creadoEn: "2024-02-01T10:00:00Z",
  },
  {
    id: "clase-004",
    nombre: "Pilates Core",
    tipo: "pilates",
    instructorNombre: "Luciana Ponce",
    instructorEmail: "luciana.ponce@gymfit.com",
    dias: ["martes", "jueves"],
    horaInicio: "10:00",
    horaFin: "11:00",
    capacidadMaxima: 10,
    inscriptos: 7,
    sala: "Sala Zen – Piso 2",
    descripcion: "Pilates con énfasis en la zona media y postura. Ideal para rehabilitación y tonificación.",
    activa: true,
    creadoEn: "2024-02-10T09:00:00Z",
  },
  {
    id: "clase-005",
    nombre: "Zumba Fitness",
    tipo: "zumba",
    instructorNombre: "Carla Medina",
    instructorEmail: "carla.medina@gymfit.com",
    dias: ["lunes", "miercoles", "viernes"],
    horaInicio: "18:00",
    horaFin: "19:00",
    capacidadMaxima: 25,
    inscriptos: 22,
    sala: "Salón Principal – Piso 3",
    descripcion: "Baile aeróbico con ritmos latinos. Divertido, enérgico y efectivo para quemar calorías.",
    activa: true,
    creadoEn: "2024-03-01T09:00:00Z",
  },
  {
    id: "clase-006",
    nombre: "Boxeo Técnico",
    tipo: "boxeo",
    instructorNombre: "Hernán Villalba",
    instructorEmail: "hernan.villalba@gymfit.com",
    dias: ["martes", "jueves", "sabado"],
    horaInicio: "20:00",
    horaFin: "21:15",
    capacidadMaxima: 16,
    inscriptos: 11,
    sala: "Sala Boxeo – Subsuelo",
    descripcion: "Técnica de boxeo, guanteo controlado y acondicionamiento físico de alto nivel.",
    activa: true,
    creadoEn: "2024-03-15T09:00:00Z",
  },
  {
    id: "clase-007",
    nombre: "Yoga Avanzado",
    tipo: "yoga",
    instructorNombre: "Andrea Suárez",
    instructorEmail: "andrea.suarez@gymfit.com",
    dias: ["sabado"],
    horaInicio: "09:00",
    horaFin: "10:30",
    capacidadMaxima: 10,
    inscriptos: 6,
    sala: "Sala Zen – Piso 2",
    descripcion: "Práctica avanzada de yoga con posturas invertidas y trabajo de respiración profunda.",
    activa: true,
    creadoEn: "2024-04-01T09:00:00Z",
  },
  {
    id: "clase-008",
    nombre: "Pilates Reformer",
    tipo: "pilates",
    instructorNombre: "Luciana Ponce",
    instructorEmail: "luciana.ponce@gymfit.com",
    dias: ["lunes", "miercoles"],
    horaInicio: "11:00",
    horaFin: "12:00",
    capacidadMaxima: 6,
    inscriptos: 4,
    sala: "Sala Reformer – Piso 2",
    descripcion: "Pilates en máquina Reformer para trabajo profundo de elongación y tono muscular.",
    activa: false,
    creadoEn: "2024-04-20T09:00:00Z",
  },
];

export function getSocioById(id: string): Socio | undefined {
  return socios.find((s) => s.id === id);
}

export function getPlanById(id: string): Plan | undefined {
  return planes.find((p) => p.id === id);
}

export function getMembresiasBySocioId(socioId: string): Membresia[] {
  return membresias.filter((m) => m.socioId === socioId);
}

export function getMembresiaActiva(socioId: string): Membresia | undefined {
  return membresias.find((m) => m.socioId === socioId && m.estado === "activa");
}

export function getClasesActivas(): Clase[] {
  return clases.filter((c) => c.activa);
}

export function getOcupacionClase(clase: Clase): number {
  return Math.round((clase.inscriptos / clase.capacidadMaxima) * 100);
}

export const metricasResumen = {
  totalSocios: socios.length,
  sociosActivos: socios.filter((s) => s.estado === "activo").length,
  membresiasActivas: membresias.filter((m) => m.estado === "activa").length,
  clasesActivas: clases.filter((c) => c.activa).length,
  ingresosMes: membresias
    .filter((m) => m.estado === "activa" && m.fechaInicio.startsWith("2026-06"))
    .reduce((acc, m) => acc + m.montoPagado, 0),
  capacidadPromedio: Math.round(
    clases.filter((c) => c.activa).reduce((acc, c) => acc + getOcupacionClase(c), 0) /
      clases.filter((c) => c.activa).length
  ),
};
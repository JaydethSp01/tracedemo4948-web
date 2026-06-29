"use client";
export const dynamic = "force-dynamic";
import { Hero } from "@/components/ui/Hero";
import { AppointmentScheduler } from "@/components/ui/AppointmentScheduler";
import Link from "next/link";
import { Users, CreditCard, Calendar, DollarSign, ArrowRight, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { socios, membresias, clases, pagos } from "@/lib/mock";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: number; positive: boolean };
  href: string;
}

function MetricCard({ title, value, subtitle, icon, iconBg, trend, href }: MetricCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl`}>{icon}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const totalSocios = socios?.length;
  const membresiasActivas = (membresias ?? []).filter((m) => m.estado === "activa").length;
  const totalClases = clases?.length;
  const ingresosMes = (pagos ?? []).reduce((sum, p) => sum + p.monto, 0);

  const sociosRecientes = [...socios]
    .sort((a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime())
    .slice(0, 6);

  const clasesHoy = clases.slice(0, 4);

  const estadoBadge = (estado: string) => {
    const map: Record<string, string> = {
      activa: "bg-emerald-100 text-emerald-700",
      vencida: "bg-red-100 text-red-600",
      suspendida: "bg-amber-100 text-amber-700",
      pendiente: "bg-gray-100 text-gray-600",
    };
    return map[estado] ?? "bg-gray-100 text-gray-600";
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Hero title="GymPro" subtitle="Panel de administración" />
      <div className="mt-2"><h2 className="mb-3 text-lg font-semibold text-slate-900">Vista rápida</h2><AppointmentScheduler /></div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <MetricCard title="Total de socios" value={totalSocios} subtitle="Miembros registrados" icon={<Users className="w-5 h-5 text-indigo-600" />} iconBg="bg-indigo-50" trend={{ value: 12, positive: true }} href="/socios" />
          <MetricCard title="Membresías activas" value={membresiasActivas} subtitle={`De ${membresias?.length} membresías totales`} icon={<CreditCard className="w-5 h-5 text-emerald-600" />} iconBg="bg-emerald-50" trend={{ value: 5, positive: true }} href="/membresias" />
          <MetricCard title="Clases programadas" value={totalClases} subtitle="Esta semana" icon={<Calendar className="w-5 h-5 text-amber-600" />} iconBg="bg-amber-50" href="/clases" />
          <MetricCard title="Ingresos del mes" value={`$${ingresosMes.toLocaleString("es-AR")}`} subtitle="Junio 2026" icon={<DollarSign className="w-5 h-5 text-violet-600" />} iconBg="bg-violet-50" trend={{ value: 8, positive: true }} href="/pagos" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Socios recientes</h3>
                <p className="text-xs text-gray-400 mt-0.5">Últimos miembros incorporados</p>
              </div>
              <Link href="/socios" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/70">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Socio</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Plan</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Estado</th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Ingreso</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(sociosRecientes ?? []).map((socio) => {
                    const membresia = (membresias ?? []).find((m) => m.socioId === socio.id);
                    const initials = `${(socio.nombre ?? "").charAt(0)}${(socio.apellido ?? "").charAt(0)}`;
                    return (
                      <tr key={socio.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[socio.id % avatarColors?.length]}`}>
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{socio.nombre} {socio.apellido}</p>
                              <p className="text-xs text-gray-400 truncate">{socio.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{membresia?.planNombre ?? <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4">
                          {membresia ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${estadoBadge(membresia.estado)}`}>{membresia.estado}</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">Sin membresía</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                          {new Date(socio.fechaIngreso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/socios/${socio.id}`} className="text-gray-300 hover:text-indigo-500 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Clases de hoy</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Horario del día</p>
                </div>
                <Link href="/clases" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Ver todas</Link>
              </div>
              <ul className="divide-y divide-gray-50">
                {(clasesHoy ?? []).map((clase) => (
                  <li key={clase.id}>
                    <Link href={`/clases/${clase.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{clase.nombre}</p>
                        <p className="text-xs text-gray-400">{clase.horario} · {clase.instructor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-700">{clase.cuposDisponibles}</p>
                        <p className="text-xs text-gray-400">cupos</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Accesos rápidos</h3>
              </div>
              <ul className="p-3 space-y-1">
                {[
                  { label: "Registrar nuevo socio", href: "/socios/nuevo", dot: "bg-indigo-500" },
                  { label: "Asignar membresía", href: "/membresias/nueva", dot: "bg-emerald-500" },
                  { label: "Registrar pago", href: "/pagos/nuevo", dot: "bg-violet-500" },
                  { label: "Programar clase", href: "/clases/nueva", dot: "bg-amber-500" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
                      <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-80 mb-1">Por vencer (7 días)</h3>
              <p className="text-4xl font-bold mb-3">
                {(membresias ?? []).filter((m) => {
                  const diff = new Date(m.fechaVencimiento).getTime() - Date.now();
                  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000 && m.estado === "activa";
                }).length}
              </p>
              <p className="text-xs opacity-70 mb-4">membresías próximas a vencer</p>
              <Link href="/membresias?filtro=por-vencer" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                Gestionar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
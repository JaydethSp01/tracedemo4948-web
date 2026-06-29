"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { membresias as membresiasMock } from "@/lib/mock";

type EstadoMembresia = "activa" | "vencida" | "suspendida" | "pendiente";

interface Membresia {
  id: string;
  socioId: string;
  socioNombre: string;
  planNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoMembresia;
  precio: number;
  metodoPago: string;
}

const ESTADO_STYLES: Record<EstadoMembresia, string> = {
  activa: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  vencida: "bg-red-100 text-red-700 ring-red-200",
  suspendida: "bg-amber-100 text-amber-700 ring-amber-200",
  pendiente: "bg-blue-100 text-blue-700 ring-blue-200",
};

const PLANES = ["Mensual Básico", "Mensual Premium", "Trimestral", "Semestral", "Anual"];
const METODOS_PAGO = ["Efectivo", "Tarjeta de crédito", "Tarjeta de débito", "Transferencia", "Mercado Pago"];
const ESTADOS: EstadoMembresia[] = ["activa", "pendiente", "suspendida", "vencida"];

const EMPTY_FORM: Omit<Membresia, "id"> = {
  socioId: "",
  socioNombre: "",
  planNombre: "Mensual Básico",
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
  estado: "activa",
  precio: 0,
  metodoPago: "Efectivo",
};

export default function MembresiasPage() {
  const [membresias, setMembresias] = useState<Membresia[]>(membresiasMock);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Membresia, "id">>(EMPTY_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Membresia, "id">, string>>>({});

  const filtered = (membresias ?? []).filter((m) => {
    const matchSearch =
      (m.socioNombre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.planNombre ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.socioId ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos" || m.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const stats = {
    total: membresias?.length,
    activas: (membresias ?? []).filter((m) => m.estado === "activa").length,
    vencidas: (membresias ?? []).filter((m) => m.estado === "vencida").length,
    ingresosMes: membresias
      .filter((m) => m.estado === "activa")
      .reduce((acc, m) => acc + m.precio, 0),
  };

  function validate(data: Omit<Membresia, "id">) {
    const e: typeof errors = {};
    if (!(data.socioNombre ?? "").trim()) e.socioNombre = "El nombre del socio es obligatorio.";
    if (!(data.socioId ?? "").trim()) e.socioId = "El ID del socio es obligatorio.";
    if (!data.fechaInicio) e.fechaInicio = "La fecha de inicio es obligatoria.";
    if (!data.fechaFin) e.fechaFin = "La fecha de fin es obligatoria.";
    if (data.fechaFin && data.fechaInicio && data.fechaFin < data.fechaInicio)
      e.fechaFin = "La fecha de fin debe ser posterior a la de inicio.";
    if (data.precio <= 0) e.precio = "El precio debe ser mayor a 0.";
    return e;
  }

  function openCreate() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setShowForm(true);
  }

  function openEdit(m: Membresia) {
    const { id, ...rest } = m;
    setFormData(rest);
    setEditingId(id);
    setErrors({});
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (editingId) {
      setMembresias((prev) =>
        (prev ?? []).map((m) => (m.id === editingId ? { ...formData, id: editingId } : m))
      );
    } else {
      const newId = `MEM-${Date.now().toString().slice(-5)}`;
      setMembresias((prev) => [{ ...formData, id: newId }, ...prev]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setErrors({});
  }

  function handleDelete(id: string) {
    setMembresias((prev) => (prev ?? []).filter((m) => m.id !== id));
    setDeleteConfirmId(null);
  }

  function handleFieldChange<K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-gray-700">
          <span className="text-xl font-bold tracking-tight text-white">
            <span className="text-indigo-400">Gym</span>Manager
          </span>
          <p className="text-xs text-gray-400 mt-0.5">Panel de gestión</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { href: "/", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { href: "/socio", label: "Socios", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { href: "/membresia", label: "Membresías", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
            { href: "/plan", label: "Planes", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            { href: "/clase", label: "Clases", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { href: "/pago", label: "Pagos", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" },
          ].map(({ href, label, icon }) => {
            const active = href === "/membresia";
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AD</div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">Recepción</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Membresías</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestión de membresías y suscripciones de socios</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva membresía
          </button>
        </div>

        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total membresías", value: stats.total, color: "text-gray-900", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
            { label: "Activas", value: stats.activas, color: "text-emerald-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Vencidas", value: stats.vencidas, color: "text-red-600", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Ingresos activos", value: `$${(stats.ingresosMes ?? 0).toLocaleString("es-AR")}`, color: "text-indigo-600", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                  <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4 p-4">
            <div className="relative flex-1 max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar socio o plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              {["todos", ...ESTADOS].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFilterEstado(estado)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                    filterEstado === estado
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
            <p className="ml-auto text-xs text-gray-400 shrink-0">
              {filtered?.length} resultado{filtered?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["ID", "Socio", "Plan", "Inicio", "Vencimiento", "Estado", "Precio", "Pago", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-14 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="font-medium text-sm">Sin resultados</p>
                    <p className="text-xs mt-1">Prueba ajustando los filtros</p>
                  </td>
                </tr>
              ) : (
                (filtered ?? []).map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-gray-400">{m.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {(m.socioNombre ?? "").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{m.socioNombre}</p>
                          <p className="text-xs text-gray-400">{m.socioId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-700">{m.planNombre}</td>
                    <td className="px-5 py-3.5 text-gray-600">{m.fechaInicio}</td>
                    <td className="px-5 py-3.5 text-gray-600">{m.fechaFin}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset capitalize ${ESTADO_STYLES[m.estado]}`}>
                        {m.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">${(m.precio ?? 0).toLocaleString("es-AR")}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{m.metodoPago}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(m)}
                          title="Editar"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(m.id)}
                          title="Eliminar"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editingId ? "Editar membresía" : "Nueva membresía"}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{editingId ? `Editando ID: ${editingId}` : "Complete los datos del formulario"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre del socio *</label>
                  <input
                    type="text"
                    value={formData.socioNombre}
                    onChange={(e) => handleFieldChange("socioNombre", e.target.value)}
                    placeholder="Ej: Laura Fernández"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.socioNombre ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.socioNombre && <p className="text-red-500 text-xs mt-1">{errors.socioNombre}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">ID Socio *</label>
                  <input
                    type="text"
                    value={formData.socioId}
                    onChange={(e) => handleFieldChange("socioId", e.target.value)}
                    placeholder="Ej: SOC-001"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.socioId ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.socioId && <p className="text-red-500 text-xs mt-1">{errors.socioId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plan</label>
                <select
                  value={formData.planNombre}
                  onChange={(e) => handleFieldChange("planNombre", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {(PLANES ?? []).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha inicio *</label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => handleFieldChange("fechaInicio", e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.fechaInicio ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha fin *</label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => handleFieldChange("fechaFin", e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.fechaFin ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Precio (ARS) *</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.precio === 0 ? "" : formData.precio}
                    onChange={(e) => handleFieldChange("precio", parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 15000"
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${errors.precio ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Método de pago</label>
                  <select
                    value={formData.metodoPago}
                    onChange={(e) => handleFieldChange("metodoPago", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    {(METODOS_PAGO ?? []).map((mp) => <option key={mp} value={mp}>{mp}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Estado</label>
                <div className="flex gap-2">
                  {(ESTADOS ?? []).map((est) => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => handleFieldChange("estado", est)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                        formData.estado === est
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {est}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow transition-colors"
                >
                  {editingId ? "Guardar cambios" : "Crear membresía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Eliminar membresía</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Esta acción no se puede deshacer. ¿Confirmas eliminar la membresía{" "}
              <span className="font-semibold text-gray-700">{deleteConfirmId}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
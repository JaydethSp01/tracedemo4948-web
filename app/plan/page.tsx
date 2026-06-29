"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Link from "next/link";
import { planes as mockPlanes, type Plan } from "@/lib/mock";

type FormData = {
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
  beneficios: string;
  activo: boolean;
};

const DURACION_OPTIONS = [
  { label: "1 mes (30 días)", value: 30 },
  { label: "3 meses (90 días)", value: 90 },
  { label: "6 meses (180 días)", value: 180 },
  { label: "1 año (365 días)", value: 365 },
];

const defaultForm: FormData = {
  nombre: "",
  precio: 0,
  duracion: 30,
  descripcion: "",
  beneficios: "",
  activo: true,
};

function planToForm(plan: Plan): FormData {
  return {
    nombre: plan.nombre,
    precio: plan.precio,
    duracion: plan.duracion,
    descripcion: plan.descripcion,
    beneficios: (plan.beneficios ?? []).join(", "),
    activo: plan.activo,
  };
}

function duracionLabel(dias: number): string {
  if (dias === 30) return "1 mes";
  if (dias === 90) return "3 meses";
  if (dias === 180) return "6 meses";
  if (dias === 365) return "1 año";
  return `${dias} días`;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/socios", label: "Socios", icon: "👥" },
  { href: "/membresia", label: "Membresías", icon: "🎫" },
  { href: "/plan", label: "Planes", icon: "📋" },
  { href: "/clase", label: "Clases", icon: "🏋️" },
  { href: "/pagos", label: "Pagos", icon: "💳" },
];

export default function PlanesPage() {
  const [planes, setPlanes] = useState<Plan[]>(mockPlanes);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (planes ?? []).filter(
    (p) =>
      (p.nombre ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalActivos = (planes ?? []).filter((p) => p.activo).length;
  const precioPromedio =
    planes?.length > 0
      ? Math.round((planes ?? []).reduce((s, p) => s + p.precio, 0) / planes?.length)
      : 0;
  const planMasPopular = (planes ?? []).reduce(
    (prev, curr) => (curr.precio > prev.precio ? curr : prev),
    planes[0]
  );

  function openCreate() {
    setEditingId(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(plan: Plan) {
    setEditingId(plan.id);
    setForm(planToForm(plan));
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const beneficios = form.beneficios
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    if (editingId) {
      setPlanes((prev) =>
        (prev ?? []).map((p) =>
          p.id === editingId ? { ...p, ...form, beneficios } : p
        )
      );
    } else {
      const newPlan: Plan = {
        id: `plan-${Date.now()}`,
        ...form,
        beneficios,
      };
      setPlanes((prev) => [...prev, newPlan]);
    }
    closeModal();
  }

  function handleDelete(id: string) {
    setPlanes((prev) => (prev ?? []).filter((p) => p.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-gray-700 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-bold">
            G
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">GymOS</span>
            <span className="ml-1.5 text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-semibold">
              PRO
            </span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {(NAV_LINKS ?? []).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.href === "/plan"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Administrador</p>
              <p className="text-xs text-gray-400 truncate">admin@gymos.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Planes de Membresía</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configura y gestiona los planes disponibles para tus socios
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Plan
          </button>
        </header>

        <div className="px-8 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 font-medium">Total Planes</p>
                <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                  📋
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{planes?.length}</p>
              <p className="text-xs text-gray-400 mt-1">registrados en el sistema</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 font-medium">Planes Activos</p>
                <span className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-lg">
                  ✅
                </span>
              </div>
              <p className="text-3xl font-bold text-green-600">{totalActivos}</p>
              <p className="text-xs text-gray-400 mt-1">
                {planes?.length - totalActivos} inactivos
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500 font-medium">Precio Promedio</p>
                <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">
                  💰
                </span>
              </div>
              <p className="text-3xl font-bold text-indigo-600">${precioPromedio}</p>
              <p className="text-xs text-gray-400 mt-1">
                más alto: {planMasPopular?.nombre ?? "—"}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-base font-semibold text-gray-800">
                Lista de Planes
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filtered?.length} resultado{filtered?.length !== 1 ? "s" : ""})
                </span>
              </h2>
              <div className="relative w-full sm:w-60">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar plan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Plan</th>
                    <th className="px-6 py-3">Precio</th>
                    <th className="px-6 py-3">Duración</th>
                    <th className="px-6 py-3">Beneficios</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <span className="text-3xl">🔍</span>
                          <p className="font-medium">No se encontraron planes</p>
                          <p className="text-xs">
                            Intenta con otro término de búsqueda
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (filtered ?? []).map((plan) => (
                      <tr
                        key={plan.id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {plan.nombre}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5 max-w-[200px] truncate">
                              {plan.descripcion}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-gray-900">
                              ${plan.precio}
                            </span>
                            <span className="text-gray-400 text-xs">
                              /{duracionLabel(plan.duracion)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {duracionLabel(plan.duracion)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[260px]">
                            {plan.beneficios.slice(0, 3).map((b, i) => (
                              <span
                                key={i}
                                className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                              >
                                {b}
                              </span>
                            ))}
                            {plan.beneficios?.length > 3 && (
                              <span className="text-gray-400 text-xs self-center">
                                +{plan.beneficios?.length - 3} más
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {plan.activo ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(plan)}
                              title="Editar plan"
                              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeleteId(plan.id)}
                              title="Eliminar plan"
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
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

            {filtered?.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                Mostrando {filtered?.length} de {planes?.length} planes registrados
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editingId ? "Editar Plan" : "Crear Nuevo Plan"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingId
                    ? "Modifica los datos del plan seleccionado"
                    : "Completa los campos para añadir un nuevo plan"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre del Plan{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Plan Premium Anual"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />
              </div>

              {/* Precio + Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Precio (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      required
                      min={0}
                      step={0.01}
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duración <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="duracion"
                    value={form.duracion}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition"
                  >
                    {(DURACION_OPTIONS ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Breve descripción visible para los socios..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
                />
              </div>

              {/* Beneficios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Beneficios{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    (separados por comas)
                  </span>
                </label>
                <textarea
                  name="beneficios"
                  value={form.beneficios}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Acceso al gym, Vestuarios, Clases grupales, Zona cardio..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
                />
                {form.beneficios && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.beneficios
                      .split(",")
                      .map((b) => b.trim())
                      .filter(Boolean)
                      .map((b, i) => (
                        <span
                          key={i}
                          className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {b}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Activo toggle */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Plan activo
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Los planes inactivos no aparecen en la venta
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  {editingId ? "Guardar Cambios" : "Crear Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Eliminar Plan
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              ¿Confirmas que deseas eliminar el plan{" "}
              <span className="font-semibold text-gray-900">
                &quot;{(planes ?? []).find((p) => p.id === deleteId)?.nombre}&quot;
              </span>
              ? Las membresías activas con este plan no serán afectadas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
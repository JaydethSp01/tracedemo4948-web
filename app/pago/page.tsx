"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { pagos as initialPagos } from "@/lib/mock";
import Link from "next/link";

type EstadoPago = "pagado" | "pendiente" | "vencido";
type MetodoPago = "efectivo" | "tarjeta" | "transferencia";

export interface Pago {
  id: number;
  socioNombre: string;
  membresiaNombre: string;
  monto: number;
  fecha: string;
  estado: EstadoPago;
  metodo: MetodoPago;
}

const estadoStyles: Record<EstadoPago, string> = {
  pagado: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  pendiente: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  vencido: "bg-red-100 text-red-800 ring-1 ring-red-200",
};

const estadoLabel: Record<EstadoPago, string> = {
  pagado: "Pagado",
  pendiente: "Pendiente",
  vencido: "Vencido",
};

const metodoLabel: Record<MetodoPago, { label: string; icon: string }> = {
  efectivo: { label: "Efectivo", icon: "💵" },
  tarjeta: { label: "Tarjeta", icon: "💳" },
  transferencia: { label: "Transferencia", icon: "🏦" },
};

const FORM_INICIAL: Omit<Pago, "id"> = {
  socioNombre: "",
  membresiaNombre: "",
  monto: 0,
  fecha: new Date().toISOString().split("T")[0],
  estado: "pendiente",
  metodo: "efectivo",
};

export default function PagoPage() {
  const [pagos, setPagos] = useState<Pago[]>(initialPagos);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Pago | null>(null);
  const [form, setForm] = useState<Omit<Pago, "id">>(FORM_INICIAL);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoPago | "">("");
  const [eliminarId, setEliminarId] = useState<number | null>(null);

  const pagosFiltrados = (pagos ?? []).filter((p) => {
    const coincideBusqueda =
      (p.socioNombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.membresiaNombre ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado === "" || p.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const totalPagado = pagos
    .filter((p) => p.estado === "pagado")
    .reduce((acc, p) => acc + p.monto, 0);

  const totalPendiente = pagos
    .filter((p) => p.estado === "pendiente")
    .reduce((acc, p) => acc + p.monto, 0);

  const totalVencido = pagos
    .filter((p) => p.estado === "vencido")
    .reduce((acc, p) => acc + p.monto, 0);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_INICIAL);
    setShowModal(true);
  };

  const abrirEditar = (pago: Pago) => {
    setEditando(pago);
    const { id, ...resto } = pago;
    setForm(resto);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      setPagos((prev) =>
        (prev ?? []).map((p) => (p.id === editando.id ? { ...form, id: editando.id } : p))
      );
    } else {
      const nuevoId = Math.max(0, ...pagos.map((p) => p.id)) + 1;
      setPagos((prev) => [{ ...form, id: nuevoId }, ...prev]);
    }
    setShowModal(false);
  };

  const handleEliminar = (id: number) => {
    setPagos((prev) => (prev ?? []).filter((p) => p.id !== id));
    setEliminarId(null);
  };

  const formatMoneda = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const formatFecha = (f: string) =>
    new Date(f + "T00:00:00").toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-xl font-bold text-gray-900">Pagos</h1>
          </div>
          <button
            onClick={abrirCrear}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Pago
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Total Recaudado</p>
              <span className="bg-emerald-50 text-emerald-600 rounded-lg p-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatMoneda(totalPagado)}</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">
              {(pagos ?? []).filter((p) => p.estado === "pagado").length} pagos confirmados
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Pendiente de Cobro</p>
              <span className="bg-amber-50 text-amber-600 rounded-lg p-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatMoneda(totalPendiente)}</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              {(pagos ?? []).filter((p) => p.estado === "pendiente").length} pagos pendientes
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Vencidos</p>
              <span className="bg-red-50 text-red-600 rounded-lg p-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatMoneda(totalVencido)}</p>
            <p className="text-xs text-red-600 mt-1 font-medium">
              {(pagos ?? []).filter((p) => p.estado === "vencido").length} pagos vencidos
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">Registros Totales</p>
              <span className="bg-blue-50 text-blue-600 rounded-lg p-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{pagos?.length}</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">pagos registrados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por socio o membresía..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoPago | "")}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
            </select>
            {(busqueda || filtroEstado) && (
              <button
                onClick={() => { setBusqueda(""); setFiltroEstado(""); }}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-2.5 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          {(busqueda || filtroEstado) && (
            <p className="mt-2 text-xs text-gray-400">
              Mostrando {pagosFiltrados?.length} de {pagos?.length} registros
            </p>
          )}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    ID
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Socio
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Membresía
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Monto
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Fecha
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Método
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-left px-6 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagosFiltrados?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm font-medium">No se encontraron pagos</span>
                        <span className="text-xs">Intenta con otros filtros o registra un nuevo pago</span>
                      </div>
                    </td>
                  </tr>
                )}
                {(pagosFiltrados ?? []).map((pago) => (
                  <tr key={pago.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs font-medium">
                      #{String(pago.id).padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {(pago.socioNombre ?? "").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{pago.socioNombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{pago.membresiaNombre}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{formatMoneda(pago.monto)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatFecha(pago.fecha)}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <span>{metodoLabel[pago.metodo].icon}</span>
                        <span>{metodoLabel[pago.metodo].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoStyles[pago.estado]}`}
                      >
                        {estadoLabel[pago.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => abrirEditar(pago)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Editar
                        </button>
                        {eliminarId === pago.id ? (
                          <span className="flex items-center gap-2">
                            <button
                              onClick={() => handleEliminar(pago.id)}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setEliminarId(null)}
                              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                            >
                              Cancelar
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setEliminarId(pago.id)}
                            className="text-gray-400 hover:text-red-600 font-medium text-sm transition-colors"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagosFiltrados?.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              {pagosFiltrados?.length} {pagosFiltrados?.length === 1 ? "registro" : "registros"}
            </div>
          )}
        </div>
      </main>

      {/* Modal Crear / Editar */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editando ? "Editar Pago" : "Registrar Nuevo Pago"}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editando ? `Modificando pago #${String(editando.id).padStart(4, "0")}` : "Completa los datos del pago"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nombre del Socio <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.socioNombre}
                    onChange={(e) => setForm({ ...form, socioNombre: e.target.value })}
                    placeholder="Ej: Ana García"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Membresía <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.membresiaNombre}
                    onChange={(e) => setForm({ ...form, membresiaNombre: e.target.value })}
                    placeholder="Ej: Plan Premium Mensual"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Monto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={form.monto}
                      onChange={(e) => setForm({ ...form, monto: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Método de Pago
                  </label>
                  <select
                    value={form.metodo}
                    onChange={(e) => setForm({ ...form, metodo: e.target.value as MetodoPago })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">🏦 Transferencia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoPago })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                >
                  {editando ? "Guardar Cambios" : "Registrar Pago"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
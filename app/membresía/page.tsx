"use client";
export const dynamic = "force-dynamic";
import { useState } from 'react';
import { membresias as membresiasMock } from '@/lib/mock';

export type Membresia = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionDias: number;
  activa: boolean;
  color: string;
  socios: number;
};

type FormData = {
  nombre: string;
  descripcion: string;
  precio: string;
  duracionDias: string;
  activa: boolean;
  color: string;
};

const EMPTY_FORM: FormData = {
  nombre: '',
  descripcion: '',
  precio: '',
  duracionDias: '30',
  activa: true,
  color: 'indigo',
};

const COLORES = [
  { value: 'indigo', label: 'Índigo', dot: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { value: 'emerald', label: 'Esmeralda', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'violet', label: 'Violeta', dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  { value: 'amber', label: 'Ámbar', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'rose', label: 'Rosa', dot: 'bg-rose-500', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  { value: 'sky', label: 'Cielo', dot: 'bg-sky-500', badge: 'bg-sky-100 text-sky-700 border-sky-200' },
];

function colorConfig(color: string) {
  return (COLORES ?? []).find((c) => c.value === color) ?? COLORES[0];
}

function duracionLabel(dias: number): string {
  if (dias === 1) return '1 día';
  if (dias < 30) return `${dias} días`;
  if (dias === 30) return '1 mes';
  if (dias < 365) return `${Math.round(dias / 30)} meses`;
  if (dias === 365) return '1 año';
  return `${Math.round(dias / 365)} años`;
}

let _nextId = 200;

export default function MembresiaPage() {
  const [membresias, setMembresias] = useState<Membresia[]>(membresiasMock);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterActiva, setFilterActiva] = useState<'todas' | 'activas' | 'inactivas'>('todas');

  const filtered = (membresias ?? []).filter((m) => {
    const matchSearch =
      (m.nombre ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (m.descripcion ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterActiva === 'todas' ||
      (filterActiva === 'activas' && m.activa) ||
      (filterActiva === 'inactivas' && !m.activa);
    return matchSearch && matchFilter;
  });

  const totalActivas = (membresias ?? []).filter((m) => m.activa).length;
  const precioPromedio = membresias?.length
    ? Math.round((membresias ?? []).reduce((sum, m) => sum + m.precio, 0) / membresias?.length)
    : 0;
  const totalSocios = (membresias ?? []).reduce((sum, m) => sum + (m.socios ?? 0), 0);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(m: Membresia) {
    setForm({
      nombre: m.nombre,
      descripcion: m.descripcion,
      precio: String(m.precio),
      duracionDias: String(m.duracionDias),
      activa: m.activa,
      color: m.color,
    });
    setEditingId(m.id);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(form.nombre ?? "").trim() || !form.precio) return;

    const precio = parseFloat(form.precio);
    const duracionDias = parseInt(form.duracionDias, 10);

    if (editingId !== null) {
      setMembresias((prev) =>
        (prev ?? []).map((m) =>
          m.id === editingId
            ? {
                ...m,
                nombre: (form.nombre ?? "").trim(),
                descripcion: (form.descripcion ?? "").trim(),
                precio,
                duracionDias,
                activa: form.activa,
                color: form.color,
              }
            : m
        )
      );
    } else {
      const nueva: Membresia = {
        id: ++_nextId,
        nombre: (form.nombre ?? "").trim(),
        descripcion: (form.descripcion ?? "").trim(),
        precio,
        duracionDias,
        activa: form.activa,
        color: form.color,
        socios: 0,
      };
      setMembresias((prev) => [nueva, ...prev]);
    }

    setShowForm(false);
    setEditingId(null);
  }

  function handleDelete(id: number) {
    setMembresias((prev) => (prev ?? []).filter((m) => m.id !== id));
    setDeleteConfirm(null);
  }

  function handleToggleActiva(id: number) {
    setMembresias((prev) =>
      (prev ?? []).map((m) => (m.id === id ? { ...m, activa: !m.activa } : m))
    );
  }

  const membresiaToDelete = (membresias ?? []).find((m) => m.id === deleteConfirm);

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membresías</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona los planes y suscripciones del gimnasio
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva membresía
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Total planes
            </p>
            <span className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{membresias?.length}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">{totalActivas} activos</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Precio promedio
            </p>
            <span className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">
            ${precioPromedio.toLocaleString('es-MX')}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">MXN por plan</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Socios inscritos
            </p>
            <span className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{totalSocios}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">en todos los planes</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
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
              placeholder="Buscar plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
            {(['todas', 'activas', 'inactivas'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterActiva(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                  filterActiva === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 sm:ml-auto">
            {filtered?.length} {filtered?.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Plan
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Duración
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Precio
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Socios
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-400 font-medium">No se encontraron membresías</p>
                      <p className="text-gray-300 text-xs">Intenta ajustar los filtros o crear una nueva</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (filtered ?? []).map((m) => {
                  const cc = colorConfig(m.color);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${cc.dot}`} />
                          <div>
                            <p className="font-semibold text-gray-900">{m.nombre}</p>
                            {m.descripcion && (
                              <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] truncate">
                                {m.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cc.badge}`}>
                          {duracionLabel(m.duracionDias)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900 text-base">
                          ${(m.precio ?? 0).toLocaleString('es-MX')}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">MXN</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-gray-700 font-medium">{m.socios}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActiva(m.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                            m.activa
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              m.activa ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                          {m.activa ? 'Activa' : 'Inactiva'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(m)}
                            title="Editar"
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(m.id)}
                            title="Eliminar"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <h2 className="text-base font-semibold text-gray-900">
                  {editingId !== null ? 'Editar membresía' : 'Nueva membresía'}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre del plan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Mensual Premium, Anual Básico..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Acceso a equipos, clases grupales, estacionamiento..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none placeholder-gray-300"
                />
              </div>

              {/* Precio y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Precio (MXN) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      value={form.precio}
                      onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Duración <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.duracionDias}
                    onChange={(e) => setForm((f) => ({ ...f, duracionDias: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="7">1 semana</option>
                    <option value="15">15 días</option>
                    <option value="30">1 mes</option>
                    <option value="60">2 meses</option>
                    <option value="90">3 meses</option>
                    <option value="180">6 meses</option>
                    <option value="365">1 año</option>
                  </select>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color identificador
                </label>
                <div className="flex items-center gap-2.5">
                  {(COLORES ?? []).map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c.value }))}
                      title={c.label}
                      className={`w-8 h-8 rounded-full ${c.dot} flex items-center justify-center transition-transform hover:scale-110 ${
                        form.color === c.value
                          ? 'ring-2 ring-offset-2 ring-gray-500 scale-110'
                          : ''
                      }`}
                    >
                      {form.color === c.value && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle activa */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-700">Membresía activa</p>
                  <p className="text-xs text-gray-400">Los socios podrán inscribirse a este plan</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, activa: !f.activa }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    form.activa ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.activa ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
                >
                  {editingId !== null ? 'Guardar cambios' : 'Crear membresía'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Eliminar membresía</h3>
              {membresiaToDelete && (
                <p className="text-sm font-semibold text-indigo-600 mb-2">
                  &ldquo;{membresiaToDelete.nombre}&rdquo;
                </p>
              )}
              <p className="text-sm text-gray-500 mb-6">
                Esta acción es permanente y no se puede deshacer. Los socios con este plan activo{' '}
                <span className="font-medium text-gray-700">no serán eliminados</span>.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
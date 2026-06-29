"use client";
export const dynamic = "force-dynamic";
import { useState, useMemo } from 'react'
import { socios as mockSocios } from '@/lib/mock'

type EstadoSocio = 'activo' | 'inactivo' | 'suspendido'

type Socio = {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  fechaNacimiento: string
  fechaInscripcion: string
  estado: EstadoSocio
  plan: string
}

const PLANES = ['Basic', 'Standard', 'Premium', 'Elite'] as const
const ESTADOS: EstadoSocio[] = ['activo', 'inactivo', 'suspendido']

const ESTADO_STYLES: Record<EstadoSocio, string> = {
  activo: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  inactivo: 'bg-gray-100 text-gray-600 border border-gray-200',
  suspendido: 'bg-red-100 text-red-600 border border-red-200',
}

const PLAN_COLORS: Record<string, string> = {
  Basic: 'bg-slate-100 text-slate-600',
  Standard: 'bg-blue-100 text-blue-700',
  Premium: 'bg-violet-100 text-violet-700',
  Elite: 'bg-amber-100 text-amber-700',
}

const EMPTY_FORM: Omit<Socio, 'id'> = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  fechaInscripcion: new Date().toISOString().split('T')[0],
  estado: 'activo',
  plan: 'Standard',
}

export default function SociosPage() {
  const [socios, setSocios] = useState<Socio[]>(mockSocios as Socio[])
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Socio, 'id'>>(EMPTY_FORM)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<Socio, 'id'>, string>>>({})

  const stats = useMemo(() => ({
    total: socios?.length,
    activos: (socios ?? []).filter(s => s.estado === 'activo').length,
    inactivos: (socios ?? []).filter(s => s.estado === 'inactivo').length,
    suspendidos: (socios ?? []).filter(s => s.estado === 'suspendido').length,
  }), [socios])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return (socios ?? []).filter(s => {
      const matchSearch =
        (s.nombre ?? "").toLowerCase().includes(q) ||
        (s.apellido ?? "").toLowerCase().includes(q) ||
        (s.email ?? "").toLowerCase().includes(q) ||
        s.telefono.includes(q)
      const matchEstado = filterEstado === 'todos' || s.estado === filterEstado
      return matchSearch && matchEstado
    })
  }, [socios, search, filterEstado])

  function openCreate() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setShowModal(true)
  }

  function openEdit(s: Socio) {
    setEditId(s.id)
    setForm({
      nombre: s.nombre,
      apellido: s.apellido,
      email: s.email,
      telefono: s.telefono,
      fechaNacimiento: s.fechaNacimiento,
      fechaInscripcion: s.fechaInscripcion,
      estado: s.estado,
      plan: s.plan,
    })
    setFormErrors({})
    setShowModal(true)
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof Omit<Socio, 'id'>, string>> = {}
    if (!(form.nombre ?? "").trim()) errors.nombre = 'El nombre es obligatorio'
    if (!(form.apellido ?? "").trim()) errors.apellido = 'El apellido es obligatorio'
    if (!(form.email ?? "").trim()) errors.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido'
    if (!form.fechaInscripcion) errors.fechaInscripcion = 'La fecha de inscripción es obligatoria'
    const emailDuplicate = (socios ?? []).find(s => s.email === form.email && s.id !== editId)
    if (emailDuplicate) errors.email = 'Este email ya está registrado'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (editId !== null) {
      setSocios(prev => (prev ?? []).map(s => s.id === editId ? { ...form, id: editId } : s))
    } else {
      const newId = socios?.length > 0 ? Math.max(...socios.map(s => s.id)) + 1 : 1
      setSocios(prev => [{ ...form, id: newId }, ...prev])
    }
    setShowModal(false)
  }

  function handleDelete(id: number) {
    setSocios(prev => (prev ?? []).filter(s => s.id !== id))
    setDeleteId(null)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function formatDate(str: string) {
    if (!str) return '—'
    const d = new Date(str + 'T00:00:00')
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const socioAEliminar = (socios ?? []).find(s => s.id === deleteId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Gestión de Socios</h1>
            <p className="text-xs text-gray-500 mt-0.5">Administración de miembros del gimnasio</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Socio
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Socios</p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Activos</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.activos}</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inactivos</p>
                <p className="text-3xl font-extrabold text-gray-500 mt-1">{stats.inactivos}</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Suspendidos</p>
                <p className="text-3xl font-extrabold text-red-500 mt-1">{stats.suspendidos}</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, email o teléfono..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {(['todos', 'activo', 'inactivo', 'suspendido'] as const).map(e => (
              <button
                key={e}
                onClick={() => setFilterEstado(e)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all border ${
                  filterEstado === e
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {e === 'todos' ? 'Todos' : e}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Socio</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscripción</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No se encontraron socios</p>
                        <p className="text-gray-300 text-xs">Ajustá los filtros o creá un nuevo socio</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (filtered ?? []).map(socio => (
                    <tr key={socio.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white text-xs font-bold">
                              {socio.nombre[0]?.toUpperCase()}{socio.apellido[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{socio.nombre} {socio.apellido}</p>
                            <p className="text-xs text-gray-400">#{String(socio.id).padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{socio.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{socio.telefono || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${PLAN_COLORS[socio.plan] || 'bg-gray-100 text-gray-600'}`}>
                          {socio.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm tabular-nums">
                        {formatDate(socio.fechaInscripcion)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ESTADO_STYLES[socio.estado]}`}>
                          {socio.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(socio)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar socio"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteId(socio.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar socio"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Mostrando <span className="font-semibold text-gray-700">{filtered?.length}</span> de <span className="font-semibold text-gray-700">{socios?.length}</span> socios
              </p>
              {search || filterEstado !== 'todos' ? (
                <button
                  onClick={() => { setSearch(''); setFilterEstado('todos') }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Modal Create / Edit */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {editId !== null ? 'Editar Socio' : 'Nuevo Socio'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editId !== null ? 'Modificá los datos del socio' : 'Completá los datos para registrar un nuevo miembro'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Juan"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                        formErrors.nombre ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.nombre && <p className="text-xs text-red-500 mt-1">{formErrors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="García"
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                        formErrors.apellido ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.apellido && <p className="text-xs text-red-500 mt-1">{formErrors.apellido}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="juan.garcia@email.com"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow ${
                      formErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Teléfono</label>
                  <input
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+54 11 5555-1234"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fecha de Nacimiento</label>
                    <input
                      name="fechaNacimiento"
                      type="date"
                      value={form.fechaNacimiento}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Fecha de Inscripción <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fechaInscripcion"
                      type="date"
                      value={form.fechaInscripcion}
                      onChange={handleChange}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.fechaInscripcion ? 'border-red-400 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {formErrors.fechaInscripcion && <p className="text-xs text-red-500 mt-1">{formErrors.fechaInscripcion}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Plan</label>
                    <select
                      name="plan"
                      value={form.plan}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {(PLANES ?? []).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado</label>
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent capitalize"
                    >
                      {(ESTADOS ?? []).map(e => (
                        <option key={e} value={e} className="capitalize">{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 bg-white text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  {editId !== null ? 'Guardar Cambios' : 'Crear Socio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">¿Eliminar socio?</h3>
              {socioAEliminar && (
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  {socioAEliminar.nombre} {socioAEliminar.apellido}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-6">
                Esta acción no puede deshacerse. Se eliminarán permanentemente todos los datos del socio.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"use client";
export const dynamic = "force-dynamic";
import { useState } from 'react'
import Link from 'next/link'
import { clases as mockClases } from "@/lib/mock"

type EstadoClase = 'Activa' | 'Inactiva'

interface Clase {
  id: number
  nombre: string
  instructor: string
  dia: string
  horario: string
  capacidad: number
  inscritos: number
  estado: EstadoClase
  descripcion: string
}

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const FORM_VACIO: Omit<Clase, 'id'> = {
  nombre: '',
  instructor: '',
  dia: 'Lunes',
  horario: '',
  capacidad: 20,
  inscritos: 0,
  estado: 'Activa',
  descripcion: '',
}

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/socio', label: 'Socios', icon: '👥' },
  { href: '/membresia', label: 'Membresías', icon: '🏷️' },
  { href: '/plan', label: 'Planes', icon: '📋' },
  { href: '/clase', label: 'Clases', icon: '🏋️' },
  { href: '/pago', label: 'Pagos', icon: '💳' },
]

export default function ClasesPage() {
  const [clases, setClases] = useState<Clase[]>(mockClases)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Clase | null>(null)
  const [form, setForm] = useState<Omit<Clase, 'id'>>(FORM_VACIO)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoClase>('Todos')
  const [confirmarEliminar, setConfirmarEliminar] = useState<number | null>(null)

  const filtradas = (clases ?? []).filter(c => {
    const coincideBusqueda =
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.instructor.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.dia.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'Todos' || c.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_VACIO)
    setShowForm(true)
  }

  function abrirEditar(c: Clase) {
    setEditando(c)
    setForm({
      nombre: c.nombre,
      instructor: c.instructor,
      dia: c.dia,
      horario: c.horario,
      capacidad: c.capacidad,
      inscritos: c.inscritos,
      estado: c.estado,
      descripcion: c.descripcion,
    })
    setShowForm(true)
  }

  function cerrarForm() {
    setShowForm(false)
    setEditando(null)
    setForm(FORM_VACIO)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editando) {
      setClases(prev =>
        (prev ?? []).map(c => (c.id === editando.id ? { ...form, id: editando.id } : c))
      )
    } else {
      const nuevoId = Math.max(...clases.map(c => c.id), 0) + 1
      setClases(prev => [...prev, { ...form, id: nuevoId }])
    }
    cerrarForm()
  }

  function eliminar(id: number) {
    setClases(prev => (prev ?? []).filter(c => c.id !== id))
    setConfirmarEliminar(null)
  }

  function pctOcupacion(inscritos: number, capacidad: number) {
    return Math.min(Math.round((inscritos / capacidad) * 100), 100)
  }

  const totalInscritos = (clases ?? []).reduce((s, c) => s + c.inscritos, 0)
  const activas = (clases ?? []).filter(c => c.estado === 'Activa').length
  const instructoresUnicos = new Set((clases ?? []).map(c => c.instructor)).size
  const ocupacionMedia = clases?.length
    ? Math.round((clases ?? []).reduce((s, c) => s + pctOcupacion(c.inscritos, c.capacidad), 0) / clases?.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-base font-bold">G</span>
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">GymPro</p>
              <p className="text-gray-500 text-xs">Panel de gestión</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-0.5">
          {(NAV_ITEMS ?? []).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.href === '/clase'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-semibold">
              AD
            </div>
            <div>
              <p className="text-xs font-medium text-white">Administrador</p>
              <p className="text-xs text-gray-500">admin@gympro.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <Link href="/" className="hover:text-gray-300 transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-gray-300">Clases</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Gestión de Clases</h1>
            <p className="text-gray-400 text-sm mt-1">
              {clases?.length} clases registradas · {activas} activas
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
          >
            <span className="text-lg leading-none">+</span>
            Nueva Clase
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clases', value: clases?.length, sub: 'registradas', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', icon: '🏋️' },
            { label: 'Clases Activas', value: activas, sub: `${clases?.length - activas} inactivas`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '✅' },
            { label: 'Inscritos Total', value: totalInscritos, sub: 'participantes', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: '👤' },
            { label: 'Ocupación Media', value: `${ocupacionMedia}%`, sub: `${instructoresUnicos} instructores`, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', icon: '📊' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, instructor o día..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-gray-900 border border-gray-700 rounded-xl p-1">
            {(['Todos', 'Activa', 'Inactiva'] as const).map(op => (
              <button
                key={op}
                onClick={() => setFiltroEstado(op)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filtroEstado === op ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-auto">
            {filtradas?.length} resultado{filtradas?.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/80">
                {['Clase', 'Instructor', 'Día', 'Horario', 'Capacidad', 'Ocupación', 'Estado', 'Acciones'].map(col => (
                  <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {(filtradas ?? []).map(c => {
                const pct = pctOcupacion(c.inscritos, c.capacidad)
                const barColor = pct >= 90 ? 'bg-red-500' : pct >= 65 ? 'bg-amber-500' : 'bg-emerald-500'
                return (
                  <tr key={c.id} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-white">{c.nombre}</p>
                      {c.descripcion && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px]">{c.descripcion}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {c.instructor.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-300">{c.instructor}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">{c.dia}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-300 font-mono">{c.horario}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300 tabular-nums">{c.capacidad}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm text-gray-300 tabular-nums w-8">{c.inscritos}</span>
                        <div className="flex-1 min-w-[64px]">
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{pct}%</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        c.estado === 'Activa'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-600/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.estado === 'Activa' ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => abrirEditar(c)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmarEliminar(c.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtradas?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-4xl">🏋️</span>
                      <p className="text-gray-400 font-medium">No se encontraron clases</p>
                      <p className="text-gray-600 text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <div>
                <h2 className="text-base font-bold text-white">
                  {editando ? 'Editar Clase' : 'Nueva Clase'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editando ? `Modificando: ${editando.nombre}` : 'Completa los campos para registrar la clase'}
                </p>
              </div>
              <button
                onClick={cerrarForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Nombre de la clase *
                </label>
                <input
                  required
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Ej: Spinning Intensivo, Yoga Matinal..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
                  Instructor *
                </label>
                <input
                  required
                  value={form.instructor}
                  onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Nombre completo del instructor"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Día</label>
                  <select
                    value={form.dia}
                    onChange={e => setForm(f => ({ ...f, dia: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {(DIAS ?? []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Horario *</label>
                  <input
                    required
                    value={form.horario}
                    onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    placeholder="07:00 - 08:00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Capacidad *</label>
                  <input
                    required
                    type="number"
                    min={1}
                    max={200}
                    value={form.capacidad}
                    onChange={e => setForm(f => ({ ...f, capacidad: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Inscritos</label>
                  <input
                    type="number"
                    min={0}
                    max={form.capacidad}
                    value={form.inscritos}
                    onChange={e => setForm(f => ({ ...f, inscritos: Number(e.target.value) }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Estado</label>
                <div className="flex gap-2">
                  {(['Activa', 'Inactiva'] as const).map(op => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, estado: op }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                        form.estado === op
                          ? op === 'Activa'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-gray-500/20 border-gray-500/40 text-gray-300'
                          : 'bg-gray-800 border-gray-700 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Descripción breve de la clase y sus objetivos..."
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={cerrarForm}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                >
                  {editando ? 'Guardar cambios' : 'Crear clase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmarEliminar !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl p-7">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Eliminar clase</h3>
            <p className="text-sm text-gray-400 text-center mb-1">
              ¿Estás seguro de que quieres eliminar{' '}
              <span className="text-white font-semibold">
                {(clases ?? []).find(c => c.id === confirmarEliminar)?.nombre}
              </span>
              ?
            </p>
            <p className="text-xs text-gray-600 text-center mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(confirmarEliminar)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
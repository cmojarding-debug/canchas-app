'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevaCancha() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    descripcion: '',
    precio_hora: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('Debes iniciar sesión para publicar una cancha.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('canchas').insert({
      nombre: form.nombre,
      direccion: form.direccion,
      ciudad: form.ciudad,
      descripcion: form.descripcion,
      precio_hora: parseFloat(form.precio_hora),
      propietario_id: user.id,
      activa: true,
    })

    if (insertError) {
      setError('Error: ' + insertError.message)
      setLoading(false)
      return
    }

    router.push('/propietario')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">⚽ CanchasApp</h1>
          <a href="/propietario" className="text-gray-600 hover:text-green-600">
            ← Volver al panel
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Publicar nueva cancha</h2>
        <p className="text-gray-500 mb-8">Llena los datos de tu cancha para que los jugadores puedan reservarla.</p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la cancha</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Cancha Los Pinos"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              placeholder="Ej. Av. Insurgentes 123, Col. Roma"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
              placeholder="Ej. Ciudad de México"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe tu cancha: tipo de pasto, vestidores, estacionamiento, etc."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio por hora (MXN)</label>
            <input
              type="number"
              name="precio_hora"
              value={form.precio_hora}
              onChange={handleChange}
              required
              min="1"
              placeholder="Ej. 500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            {loading ? 'Publicando...' : 'Publicar cancha'}
          </button>
        </form>
      </div>
    </main>
  )
}

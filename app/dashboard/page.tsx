'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [reservas, setReservas] = useState<any[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUsuario(user)

      const { data } = await supabase
        .from('reservas')
        .select(`
          *,
          canchas (nombre, direccion, ciudad, precio_hora)
        `)
        .eq('jugador_id', user.id)
        .order('fecha', { ascending: false })

      setReservas(data || [])
      setCargando(false)
    }
    cargarDatos()
  }, [])

  const cancelarReserva = async (id: string) => {
    await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', id)
    setReservas(reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r))
  }

  if (cargando) return <div className="p-8 text-center">Cargando...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">⚽ CanchasApp</a>
          <div className="flex gap-3">
            <span className="px-4 py-2 text-gray-600 text-sm">{usuario?.email}</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
              className="px-4 py-2 text-red-500 hover:text-red-700 text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis reservas</h1>

        {reservas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">No tienes reservas todavía</p>
            <a href="/" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Buscar canchas
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{reserva.canchas?.nombre}</h3>
                    <p className="text-gray-500 text-sm">📍 {reserva.canchas?.direccion}</p>
                    <p className="text-gray-600 mt-2">📅 {reserva.fecha}</p>
                    <p className="text-gray-600">🕐 {reserva.hora_inicio} - {reserva.hora_fin}</p>
                    <p className="text-green-600 font-bold mt-2">${reserva.precio_total} total</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reserva.estado === 'confirmada' ? 'bg-green-100 text-green-700' :
                      reserva.estado === 'cancelada' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reserva.estado}
                    </span>
                    {reserva.estado === 'confirmada' && (
                      <div>
                        <button
                          onClick={() => cancelarReserva(reserva.id)}
                          className="block text-sm text-red-500 hover:text-red-700 mt-2"
                        >
                          Cancelar reserva
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

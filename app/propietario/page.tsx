'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PanelPropietario() {
  const [reservas, setReservas] = useState<any[]>([])
  const [canchas, setCanchas] = useState<any[]>([])
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

      const { data: canchasData } = await supabase
        .from('canchas')
        .select('*')
        .eq('propietario_id', user.id)

      setCanchas(canchasData || [])

      if (canchasData && canchasData.length > 0) {
        const canchaIds = canchasData.map((c: any) => c.id)
        const { data: reservasData } = await supabase
          .from('reservas')
          .select(`
            *,
            canchas (nombre),
            profiles (nombre, telefono)
          `)
          .in('cancha_id', canchaIds)
          .order('fecha', { ascending: false })

        setReservas(reservasData || [])
      }
      setCargando(false)
    }
    cargarDatos()
  }, [])

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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel del propietario</h1>
        <p className="text-gray-500 mb-6">Gestiona las reservas de tus canchas</p>

        {canchas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">No tienes canchas registradas todavía</p>
            <a href="/propietario/nueva-cancha" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Publicar mi cancha
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{canchas.length}</p>
                <p className="text-gray-500 text-sm">Canchas activas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{reservas.filter(r => r.estado === 'confirmada').length}</p>
                <p className="text-gray-500 text-sm">Reservas confirmadas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${reservas.filter(r => r.estado === 'confirmada').reduce((sum, r) => sum + r.precio_total, 0)}
                </p>
                <p className="text-gray-500 text-sm">Ingresos totales</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800">Reservas recientes</h2>

            {reservas.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No hay reservas todavía</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservas.map((reserva) => (
                  <div key={reserva.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{reserva.canchas?.nombre}</h3>
                        <p className="text-gray-600 text-sm mt-1">👤 {reserva.profiles?.nombre || 'Jugador'}</p>
                        <p className="text-gray-600 text-sm">📅 {reserva.fecha}</p>
                        <p className="text-gray-600 text-sm">🕐 {reserva.hora_inicio} - {reserva.hora_fin}</p>
                        <p className="text-green-600 font-bold mt-2">${reserva.precio_total}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reserva.estado === 'confirmada' ? 'bg-green-100 text-green-700' :
                        reserva.estado === 'cancelada' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reserva.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

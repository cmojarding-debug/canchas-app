'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReservaForm({ cancha }: { cancha: any }) {
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [duracion, setDuracion] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)

  const horas = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user)
    })
  }, [])

  const calcularHoraFin = (inicio: string, horas: number) => {
    const [h, m] = inicio.split(':').map(Number)
    const fin = h + horas
    return `${fin.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const handleReserva = async () => {
    if (!usuario) {
      window.location.href = '/auth/login'
      return
    }
    if (!fecha || !horaInicio) {
      setMensaje('Por favor selecciona fecha y hora.')
      return
    }

    setCargando(true)
    setMensaje('')

    const horaFin = calcularHoraFin(horaInicio, duracion)
    const precioTotal = cancha.precio_hora * duracion

    // Primero guardamos la reserva en Supabase con estado "pendiente"
    const { data: reserva, error } = await supabase.from('reservas').insert({
      cancha_id: cancha.id,
      jugador_id: usuario.id,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      precio_total: precioTotal,
      estado: 'pendiente'
    }).select().single()

    if (error) {
      setMensaje('Error al crear la reserva: ' + error.message)
      setCargando(false)
      return
    }

    // Luego creamos la preferencia de pago en Mercado Pago
    const res = await fetch('/api/crear-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        canchaId: cancha.id,
        canchaNombre: cancha.nombre,
        precio: precioTotal,
        fecha,
        horaInicio,
        horaFin,
      })
    })

    const { init_point } = await res.json()

    // Redirigimos al jugador a pagar
    window.location.href = init_point
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 h-fit">
      <h3 className="text-lg font-bold text-gray-800">Reservar cancha</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
        <select
          value={horaInicio}
          onChange={e => setHoraInicio(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Selecciona una hora</option>
          {horas.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
        <select
          value={duracion}
          onChange={e => setDuracion(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={1}>1 hora - ${cancha.precio_hora}</option>
          <option value={2}>2 horas - ${cancha.precio_hora * 2}</option>
          <option value={3}>3 horas - ${cancha.precio_hora * 3}</option>
        </select>
      </div>

      {mensaje && (
        <p className={`text-sm ${mensaje.includes('Error') || mensaje.includes('selecciona') ? 'text-red-500' : 'text-green-600'}`}>
          {mensaje}
        </p>
      )}

      <button
        onClick={handleReserva}
        disabled={cargando}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {cargando ? 'Procesando...' : usuario ? 'Pagar con Mercado Pago' : 'Inicia sesión para reservar'}
      </button>
    </div>
  )
}

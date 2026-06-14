'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Registro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('jugador')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async () => {
    setCargando(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMensaje('Error: ' + error.message)
      setCargando(false)
      return
    }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        nombre,
        tipo
      })
      setMensaje('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.')
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Crear cuenta</h1>
        <p className="text-gray-500 mb-6">Únete a CanchasApp</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soy</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="jugador">Jugador — quiero reservar canchas</option>
              <option value="propietario">Propietario — quiero publicar mi cancha</option>
            </select>
          </div>

          {mensaje && (
            <p className={`text-sm ${mensaje.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {mensaje}
            </p>
          )}

          <button
            onClick={handleRegistro}
            disabled={cargando}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes cuenta? <a href="/auth/login" className="text-green-600 hover:underline">Inicia sesión</a>
          </p>
        </div>
      </div>
    </main>
  )
}

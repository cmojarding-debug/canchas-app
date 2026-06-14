'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMensaje('Error: correo o contraseña incorrectos')
      setCargando(false)
      return
    }
    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Iniciar sesión</h1>
        <p className="text-gray-500 mb-6">Bienvenido de vuelta</p>

        <div className="space-y-4">
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
              placeholder="Tu contraseña"
            />
          </div>

          {mensaje && (
            <p className="text-sm text-red-500">{mensaje}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={cargando}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {cargando ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta? <a href="/auth/registro" className="text-green-600 hover:underline">Regístrate</a>
          </p>
        </div>
      </div>
    </main>
  )
}

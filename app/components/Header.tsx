'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-green-600">⚽ CanchasApp</a>
        <div className="flex gap-3 items-center">
          {usuario ? (
            <>
              <a href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-green-600">
                Mi panel
              </a>
              <a href="/propietario" className="px-4 py-2 text-gray-600 hover:text-green-600">
                Mis canchas
              </a>
              <button
                onClick={cerrarSesion}
                className="px-4 py-2 text-red-500 hover:text-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a href="/auth/login" className="px-4 py-2 text-gray-600 hover:text-green-600">
                Iniciar sesión
              </a>
              <a href="/auth/registro" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Registrarse
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

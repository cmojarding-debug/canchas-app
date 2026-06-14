import { supabase } from '@/lib/supabase'
import ReservaForm from './ReservaForm'

export default async function DetalleCancha({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: cancha } = await supabase
    .from('canchas')
    .select('*')
    .eq('id', id)
    .single()

  if (!cancha) {
    return <div className="p-8 text-center">Cancha no encontrada</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-green-600">⚽ CanchasApp</a>
          <div className="flex gap-3">
            <a href="/auth/login" className="px-4 py-2 text-gray-600 hover:text-green-600">Iniciar sesión</a>
            <a href="/auth/registro" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Registrarse</a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-64 bg-green-200 rounded-xl flex items-center justify-center mb-6">
          <span className="text-8xl">⚽</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{cancha.nombre}</h1>
            <p className="text-gray-500">📍 {cancha.direccion}, {cancha.ciudad}</p>
            <p className="text-gray-600">{cancha.descripcion}</p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-700 font-bold text-xl">${cancha.precio_hora}/hora</p>
            </div>
          </div>
          <ReservaForm cancha={cancha} />
        </div>
      </div>
    </main>
  )
}

import { supabase } from '@/lib/supabase'

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

  const horas = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']

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

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800">Hacer reserva</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                {horas.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="1">1 hora — ${cancha.precio_hora}</option>
                <option value="2">2 horas — ${cancha.precio_hora * 2}</option>
                <option value="3">3 horas — ${cancha.precio_hora * 3}</option>
              </select>
            </div>
            <a href="/auth/login" className="block w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-center">
              Reservar ahora
            </a>
            <p className="text-xs text-gray-400 text-center">Necesitas iniciar sesión para reservar</p>
          </div>
        </div>
      </div>
    </main>
  )
}

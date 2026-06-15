import { supabase } from '@/lib/supabase'
import Header from './components/Header'

export default async function Home() {
  const { data: canchas } = await supabase
    .from('canchas')
    .select('*')
    .eq('activa', true)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-green-600 text-white py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Encuentra y reserva tu cancha</h2>
        <p className="text-xl mb-8 text-green-100">La forma más fácil de reservar canchas de fútbol cerca de ti</p>
        <div className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="¿En qué ciudad quieres jugar?"
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-lg"
          />
          <button className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50">
            Buscar
          </button>
        </div>
      </section>

      {/* Canchas */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Canchas destacadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canchas?.map((cancha) => (
            <div key={cancha.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="bg-green-100 h-40 flex items-center justify-center">
                <span className="text-5xl">⚽</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800">{cancha.nombre}</h4>
                <p className="text-gray-500 text-sm mt-1">{cancha.ciudad}</p>
                <p className="text-gray-600 text-sm mt-2">{cancha.descripcion}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-bold">${cancha.precio_hora}/hora</span>
                  <a href={`/canchas/${cancha.id}`} className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">⚽ CanchasApp</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-green-600">
              Iniciar sesión
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Registrarse
            </button>
          </div>
        </div>
      </header>

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

      {/* Canchas destacadas */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Canchas destacadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-green-200 flex items-center justify-center">
                <span className="text-5xl">⚽</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800">Cancha Ejemplo {i}</h4>
                <p className="text-gray-500 text-sm mt-1">Ciudad de México</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-600 font-bold">$300/hora</span>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

import React from 'react';

const MainPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Barra lateral - ocupa 1/5 de la pantalla */}
      <div className="w-1/5 bg-white/80 backdrop-blur-sm shadow-xl border-r border-white/20">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Residencias
          </h2>
          {/* Navegación */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-300 font-medium">
              🏠 Inicio
            </div>
            <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-300 font-medium">
              🏢 Publicaciones
            </div>
            <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-300 font-medium">
              📅 Mis Reservas
            </div>
            <div className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white cursor-pointer transition-all duration-300 font-medium">
              👤 Perfil
            </div>
          </div>
        </div>
      </div>

      {/* Componente principal - ocupa 4/5 de la pantalla */}
      <div className="flex-1 p-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/30">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bienvenido a Residencias
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra tu próxima residencia ideal en el lugar perfecto
          </p>
          
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold">150+</div>
              <div className="text-blue-100">Residencias disponibles</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-purple-100">Estudiantes satisfechos</div>
            </div>
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold">25+</div>
              <div className="text-indigo-100">Ciudades disponibles</div>
            </div>
          </div>

          {/* Botón de acción */}
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300">
            Buscar Residencias
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 
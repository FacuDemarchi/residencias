import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';

const MainPage: React.FC = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-[3.5rem_1fr] w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      {/* Barra superior SOLO en columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-1 row-end-2 z-10 h-14 grid grid-cols-2 items-center bg-transparent border-b border-purple-200 backdrop-blur-sm">
        <span className="text-purple-700 font-semibold justify-self-start w-full truncate">Carrusel de tags (próximamente)</span>
        <button
          className="justify-self-end bg-white px-4 py-2 rounded shadow"
          onClick={() => alert('¡Botón sobre el mapa!')}
        >
          Google Login
        </button>
      </div>
      {/* Sidebar ocupa ambas filas, pegado al techo */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full">
        <Sidebar />
      </div>
      {/* ContentArea en la segunda fila y columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-2 row-end-3 h-full">
        <ContentArea />
      </div>
    </div>
  );
};

export default MainPage; 
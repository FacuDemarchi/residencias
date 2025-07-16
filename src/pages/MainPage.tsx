import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';

const MainPage: React.FC = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-[3.5rem_1fr] w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      {/* Sidebar ocupa ambas filas, pegado al techo */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full">
        <Sidebar />
      </div>
      {/* ContentArea en la segunda fila y columnas 2-6 */}
      <div className="col-start-2 col-end-6 row-start-1 row-end-3 h-full">
        <ContentArea />
      </div>
    </div>
  );
};

export default MainPage; 
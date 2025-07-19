import React from 'react';

const OrderManager: React.FC = () => {
  return (
    <div className="w-full rounded-b-2xl bg-gray-50 shadow-sm px-4 py-3 box-border flex items-center gap-2">
      <span className="text-primary font-semibold text-base flex items-center gap-1">
        Ordenar
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
          <path d="M7 14V6M7 14L4 11M7 14L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 6V14M13 6L16 9M13 6L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="recomendados">Recomendados</option>
        <option value="menor_precio">Menor precio</option>
        <option value="mayor_precio">Mayor precio</option>
        <option value="recientes">Recientes</option>
        <option value="mas_vistos">Más vistos</option>
      </select>
    </div>
  );
};

export default OrderManager; 
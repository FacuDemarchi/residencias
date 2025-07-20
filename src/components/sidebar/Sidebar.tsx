import React from 'react';
import AddressSearchBar from './AddressSearchBar';
import OrderManager from './OrderManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-4 max-w-xs min-w-[280px]">
      <div className="flex flex-col gap-2">
        <AddressSearchBar />
        <OrderManager />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mi-scrollbar">
        {[...Array(5)].map((_, i) => (
          <PublicationCard 
            key={i} 
            onClick={() => console.log(`Publication ${i + 1} clicked`)}
          />
        ))}
      </div>
      <div>
        <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 
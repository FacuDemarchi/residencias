import React from 'react';
import AddressSearchBar from './AddressSearchBar';
import FiltersManager from './FiltersManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';

const Sidebar: React.FC = () => {
  return (
    <div className="h-full w-full bg-blue-500 p-4 grid grid-rows-[auto_1fr_auto]" style={{height: '100vh'}}>
      <div>
        <AddressSearchBar />
        <FiltersManager />
      </div>
      <div className="overflow-y-auto space-y-2 mt-4">
        {[...Array(30)].map((_, i) => (
          <PublicationCard key={i} />
        ))}
      </div>
      <div className="mt-4">
        <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 
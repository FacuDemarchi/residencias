import React from 'react';
import AddressSearchBar from './AddressSearchBar';
import FiltersManager from './FiltersManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';

const Sidebar: React.FC = () => {
  return (
    <div className="col-start-1 col-end-2 h-full w-full box-border bg-blue-500 grid grid-rows-[auto_auto_1fr_auto] min-h-0">
      <AddressSearchBar />
      <FiltersManager />
      <div className="overflow-y-auto min-h-0 w-full">
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
      </div>
      <NewPublicationCard />
    </div>
  );
};

export default Sidebar; 
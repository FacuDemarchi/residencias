import React from 'react';
import AddressSearchBar from './AddressSearchBar';
import FiltersManager from './FiltersManager';
import PublicationCard from './PublicationCard';
import NewPublicationCard from './NewPublicationCard';

const Sidebar: React.FC = () => {
  return (
    <div className="col-start-1 col-end-2 row-start-1 row-end-3 h-full min-h-0 w-full box-border bg-blue-500 grid grid-rows-[auto_auto_1fr_3.5rem]">
      <div className="row-start-1 row-end-2">
        <AddressSearchBar />
      </div>
      <div className="row-start-2 row-end-3">
        <FiltersManager />
      </div>
      <div className="row-start-3 row-end-4 overflow-y-auto min-h-0 max-h-full w-full">
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
        <PublicationCard />
      </div>
      <div className="row-start-[-1]">
      <NewPublicationCard />
      </div>
    </div>
  );
};

export default Sidebar; 
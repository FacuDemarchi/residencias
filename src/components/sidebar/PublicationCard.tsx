import React from 'react';

interface PublicationCardProps {
  onClick?: () => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full rounded-xl bg-white box-border grid place-items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <span className="text-black">publication card</span>
    </button>
  );
};

export default PublicationCard; 
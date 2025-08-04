import React from 'react';

interface NewPublicationCardProps {
  onClick: () => void;
}

const NewPublicationCard: React.FC<NewPublicationCardProps> = ({ onClick }) => {
  return (
    <div 
      className="w-full h-16 rounded-xl bg-white grid place-items-center cursor-pointer hover:bg-green-50 transition box-border"
      onClick={onClick}
    >
      <div className="text-center">
        <span className="text-green-600 font-semibold">+ Crear nueva publicación</span>
      </div>
    </div>
  );
};

export default NewPublicationCard; 
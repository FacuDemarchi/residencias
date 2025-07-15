import React from 'react';

const NewPublicationCard: React.FC = () => {
  return (
    <div className="w-full h-16 border-2 border-dashed border-green-500 rounded-xl bg-white grid place-items-center cursor-pointer hover:bg-green-50 transition box-border">
      <span className="text-green-600 font-semibold">+ Crear nueva publicación</span>
    </div>
  );
};

export default NewPublicationCard; 
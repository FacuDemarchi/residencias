import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ContentArea from '../components/contentArea/ContentArea';

const MainPage: React.FC = () => {
  return (
    <div className="grid grid-cols-5 w-screen h-screen min-w-screen min-h-screen p-0 m-0">
      <Sidebar />
      <ContentArea />
    </div>
  );
};

export default MainPage; 
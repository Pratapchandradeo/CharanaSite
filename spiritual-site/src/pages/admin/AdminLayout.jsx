import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e31b23] to-black">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <main 
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ 
          marginLeft: sidebarOpen ? '16rem' : '5rem',
          padding: '2rem'
        }}
      >
        <div className="bg-black/20 rounded-xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
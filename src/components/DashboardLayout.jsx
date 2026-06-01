import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { authUser } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 flex">
      {/* Sidebar for authenticated users */}
      {authUser && <Sidebar />}

      <main className={`flex-1 transition-all duration-500 ${authUser ? 'lg:ml-80' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12 pt-28 lg:pt-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

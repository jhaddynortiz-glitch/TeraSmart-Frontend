import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarAdmin } from '../components/SidebarAdmin';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SidebarAdmin />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarVendor } from '../components/SidebarVendor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faStore } from '@fortawesome/free-solid-svg-icons';

export const VendorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Top Header Responsive en Móvil */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faStore} className="text-amber-500 text-xl" />
          <span className="font-bold text-amber-600 dark:text-amber-400">Módulo Vendedor</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-lg"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Sidebar Desktop y Drawer Móvil */}
      <div className={`fixed inset-0 z-50 md:relative md:z-auto ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        {/* Backdrop para cerrar al hacer clic afuera en móviles */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative z-10 w-64 h-full">
          <SidebarVendor onCloseMobile={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

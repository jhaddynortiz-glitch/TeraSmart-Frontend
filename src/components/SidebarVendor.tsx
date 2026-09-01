import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faReceipt, faBoxesPacking, faRightLeft, faArrowLeft, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const SidebarVendor: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen p-4 flex flex-col transition-colors duration-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mb-1">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver a Tienda
          </Link>
          <h2 className="text-lg font-bold text-amber-600 dark:text-amber-400">Módulo Vendedor</h2>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-amber-300"
          title="Cambiar Tema"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </div>
      <nav className="space-y-2 flex-1">
        <NavLink to="/vendor" end className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${isActive ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faGauge} /> Dashboard
        </NavLink>
        <NavLink to="/vendor/orders" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${isActive ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faReceipt} /> Órdenes
        </NavLink>
        <NavLink to="/vendor/products" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${isActive ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faBoxesPacking} /> Mis Productos
        </NavLink>
        <NavLink to="/vendor/transfers" className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm ${isActive ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faRightLeft} /> Transferencias Almacén
        </NavLink>
      </nav>
    </aside>
  );
};

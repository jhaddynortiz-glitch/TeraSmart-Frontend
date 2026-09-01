import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStore, faUserShield, faSignInAlt, faUserPlus, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sky-600 dark:text-sky-400 hover:opacity-90">
          <FontAwesomeIcon icon={faStore} className="text-2xl" />
          <span className="tracking-tight">TeraSmart</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white font-medium">Catálogo</Link>
          <Link to="/cart" className="text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-medium flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Carrito</span>
          </Link>
          {/* <Link to="/vendor/orders" className="text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-bold border border-amber-500/40 px-2.5 py-1 rounded-md">
            Módulo Vendedor
          </Link>
          <Link to="/admin/transfers" className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold border border-emerald-500/40 px-2.5 py-1 rounded-md flex items-center gap-1">
            <FontAwesomeIcon icon={faUserShield} />
            <span>Admin</span>
          </Link> */}

          {/* Boton Toggle Light/Dark Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <Link to="/login" className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-3 py-1.5 rounded-md flex items-center gap-1">
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1">
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Registro</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faStore, faUserShield, faSignInAlt, faUserPlus, faSun, faMoon, faSignOutAlt, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sky-600 dark:text-sky-400 hover:opacity-90">
          <FontAwesomeIcon icon={faStore} className="text-2xl" />
          <span className="tracking-tight font-extrabold">TeraSmart</span>
        </Link>
        <nav className="flex items-center space-x-5">
          <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white font-medium text-sm">Catálogo</Link>
          <Link to="/cart" className="text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 font-medium text-sm flex items-center gap-1.5">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Carrito</span>
          </Link>
          
          {(user?.role === 'VENDEDOR' || user?.role === 'SUPERADMIN') && (
            <Link to="/vendor" className="text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-bold border border-amber-500/40 px-2.5 py-1 rounded-md">
              Panel Vendedor
            </Link>
          )}

          {user?.role === 'SUPERADMIN' && (
            <Link to="/admin" className="text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold border border-emerald-500/40 px-2.5 py-1 rounded-md flex items-center gap-1">
              <FontAwesomeIcon icon={faUserShield} />
              <span>SuperAdmin</span>
            </Link>
          )}

          {/* Boton Toggle Light/Dark Mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-base" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
                    <FontAwesomeIcon icon={faUserCheck} className="text-emerald-500 text-xs" />
                    <span>{user.name}</span>
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-semibold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Cerrar Sesión"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <FontAwesomeIcon icon={faUserPlus} />
                  <span>Registro</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

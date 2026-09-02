import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faRightLeft, faBoxArchive, faTags, faCreditCard, faCartShopping, faUsers, faStore, faArrowLeft, faSun, faMoon, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SidebarAdminProps {
  onCloseMobile?: () => void;
}

export const SidebarAdmin: React.FC<SidebarAdminProps> = ({ onCloseMobile }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full min-h-screen p-4 flex flex-col transition-colors duration-200 shadow-xl md:shadow-none">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/" onClick={handleNavClick} className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 mb-1">
            <FontAwesomeIcon icon={faArrowLeft} /> Volver a Tienda
          </Link>
          <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Módulo Admin</h2>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-amber-300"
          title="Cambiar Tema"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </div>
      
      <nav className="space-y-1.5 flex-1">
        <NavLink to="/admin" end onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faGauge} /> Dashboard
        </NavLink>
        <NavLink to="/admin/transfers" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faRightLeft} /> Transferencia Almacenes
        </NavLink>
        <NavLink to="/admin/products" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faBoxArchive} /> Productos
        </NavLink>
        <NavLink to="/admin/categories" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faTags} /> Categorías
        </NavLink>
        <NavLink to="/admin/payment-methods" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faCreditCard} /> Gestión Tipos de Pago
        </NavLink>
        <NavLink to="/admin/carts" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faCartShopping} /> Carritos
        </NavLink>
        <NavLink to="/admin/users" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faUsers} /> Usuarios
        </NavLink>
        <NavLink to="/admin/vendors" onClick={handleNavClick} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <FontAwesomeIcon icon={faStore} /> Vendedores
        </NavLink>
      </nav>

      {/* Boton Cerrar Sesión abajo */}
      <div className="pt-4 mt-auto border-t border-slate-200 dark:border-slate-700">
        {user && (
          <div className="mb-3 px-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

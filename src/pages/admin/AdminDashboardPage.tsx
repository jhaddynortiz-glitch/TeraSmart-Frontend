import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLeft, faBoxArchive, faTags, faCreditCard, faCartShopping, faUsers, faStore, faDollarSign, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Dashboard SuperAdmin</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Panel de control global del ecosistema multivendedor TeraSmart.</p>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Ventas Globales</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">$24,950.00</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Vendedores Activos</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">12 Tiendas</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faLayerGroup} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Catálogo Global</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">154 Productos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faRightLeft} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Transf. Pendientes</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">3 Solicitudes</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

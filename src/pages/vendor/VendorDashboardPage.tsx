import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faBoxesPacking, faRightLeft, faChartLine, faDollarSign, faClock } from '@fortawesome/free-solid-svg-icons';

export const VendorDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
        <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400">Dashboard Vendedor</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resumen de ventas de tu almacén asignado y accesos rápidos de gestión.</p>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Ventas del Mes</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">$4,850.00</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Órdenes Pendientes</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">8 Pedidos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Transferencias Activas</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">2 En Tránsito</p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

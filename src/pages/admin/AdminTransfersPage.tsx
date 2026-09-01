import React from 'react';

export const AdminTransfersPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Transferencia de Almacenes</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aprobación y monitoreo atómico de transferencias de inventario.</p>
      </div>
    </div>
  );
};

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faBuilding, faBoxesPacking, faUserCheck } from '@fortawesome/free-solid-svg-icons';

export const AdminVendorsPage: React.FC = () => {
  const vendors = [
    { id: 'v-1', name: 'TechStore Bolivia', email: 'techstore@vendedor.com', warehouse: 'Almacén Central Santa Cruz', productsCount: 4, sales: '$12,450.00' },
    { id: 'v-2', name: 'MegaElectro Sucursal La Paz', email: 'vendedor.lapaz@terasmart.com', warehouse: 'Sucursal La Paz Tech', productsCount: 2, sales: '$4,850.00' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <FontAwesomeIcon icon={faStore} />
          <span>Gestión de Vendedores & Tiendas Aliadas</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administración de cuentas comerciales vendedoras y sus sucursales asignadas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{v.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{v.email}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Almacén Asignado</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{v.warehouse}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Ventas Acumuladas</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{v.sales}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

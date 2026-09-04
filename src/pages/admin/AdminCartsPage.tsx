import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBasketShopping, faClock, faDollarSign, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const AdminCartsPage: React.FC = () => {
  const sampleCarts = [
    { id: 'cart-101', user: 'María Vargas (cliente@gmail.com)', itemsCount: 3, total: 2849.00, status: 'Activo', lastActive: 'Hace 5 min', items: ['Smartphone S24 Ultra', 'Auriculares Sony WH-1000XM5'] },
    { id: 'cart-102', user: 'Carlos Mendoza (carlos.m@yahoo.es)', itemsCount: 1, total: 1650.00, status: 'Abandonado', lastActive: 'Hace 2 horas', items: ['Laptop Gaming ASUS ROG Strix G16'] },
    { id: 'cart-103', user: 'Invitado (Anónimo)', itemsCount: 2, total: 760.00, status: 'Activo', lastActive: 'Hace 12 min', items: ['Auriculares Sony WH-1000XM5 (x2)'] }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <FontAwesomeIcon icon={faShoppingCart} />
          <span>Monitoreo de Carritos de Compra</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inspección en tiempo real de carritos activos, retenidos y abandonados por los clientes en la tienda.
        </p>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faBasketShopping} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Carritos Activos</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">2 Carritos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Carritos Abandonados</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">1 Carrito</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-2xl">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Valor Retenido Estimado</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">$5,259.00</p>
          </div>
        </div>
      </div>

      {/* Tabla de Carritos */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Cliente / Sesión</th>
                <th className="py-3.5 px-4">Productos Guardados</th>
                <th className="py-3.5 px-4">Monto Estimado</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Última Actividad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
              {sampleCarts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {c.user}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">
                    <ul className="list-disc list-inside">
                      {c.items.map((it, idx) => <li key={idx}>{it}</li>)}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    ${c.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.status === 'Activo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {c.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

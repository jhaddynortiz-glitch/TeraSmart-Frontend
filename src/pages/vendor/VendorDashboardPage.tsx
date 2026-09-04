import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReceipt, 
  faBoxesPacking, 
  faWarehouse, 
  faChartLine, 
  faDollarSign, 
  faClock, 
  faExclamationTriangle,
  faArrowRight,
  faStore,
  faEye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

export const VendorDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouse, setWarehouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Datos simulados/dinámicos de órdenes del vendedor
  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-7821', client: 'Carlos Mendoza', total: 154.00, items: 2, status: 'PENDIENTE', date: 'Hace 10 min' },
    { id: 'ORD-7819', client: 'María López', total: 89.50, items: 1, status: 'EN PREPARACIÓN', date: 'Hace 45 min' },
    { id: 'ORD-7815', client: 'Roberto Gómez', total: 320.00, items: 4, status: 'ENVIADO', date: 'Ayer, 16:30' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, whRes] = await Promise.all([
          productService.getProducts().catch(() => []),
          apiClient.get('/inventory/my-warehouse').catch(() => null)
        ]);
        setProducts(prodRes || []);
        if (whRes && whRes.data) {
          setWarehouse(whRes.data.warehouse || whRes.data);
        }
      } catch (err) {
        console.error('Error cargando dashboard del vendedor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lowStockCount = products.filter((p) => (p.stock !== undefined ? p.stock : 10) <= 3).length;
  const totalStockSum = products.reduce((sum, p) => sum + (p.stock !== undefined ? p.stock : 10), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
            Módulo de Vendedor
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            ¡Hola! Bienvenido a tu Panel de Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sucursal activa: <span className="font-semibold text-slate-700 dark:text-slate-300">{warehouse ? warehouse.name : 'Sucursal Cochabamba Norte'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vendor/orders"
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-amber-600/20"
          >
            <FontAwesomeIcon icon={faReceipt} />
            <span>Ver Órdenes Recibidas</span>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-amber-500" />
          <p className="text-sm text-slate-500">Cargando datos de ventas...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Métricas Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Ventas del Mes</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">$4,850.00</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Órdenes Pendientes</p>
                <p className="text-2xl font-black text-amber-600 dark:text-amber-400">8 Pedidos</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faBoxesPacking} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Stock Total Asignado</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{totalStockSum} Unid.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`p-3 rounded-xl text-2xl ${lowStockCount > 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Alertas Stock Bajo</p>
                <p className={`text-2xl font-black ${lowStockCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {lowStockCount} Productos
                </p>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos & Alerta de Reposición */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tabla Órdenes Recientes */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} className="text-amber-500" />
                  <span>Órdenes Recientes en Tu Sucursal</span>
                </h3>
                <Link to="/vendor/orders" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                  Ver Todas <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3">Código</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Monto</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-right">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-3 font-bold font-mono text-amber-600 dark:text-amber-400">{ord.id}</td>
                        <td className="p-3 font-medium text-slate-900 dark:text-white">{ord.client}</td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">${ord.total.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          {ord.status === 'PENDIENTE' && (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full text-xs font-bold">
                              Pendiente
                            </span>
                          )}
                          {ord.status === 'EN PREPARACIÓN' && (
                            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 rounded-full text-xs font-bold">
                              En Preparación
                            </span>
                          )}
                          {ord.status === 'ENVIADO' && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-bold">
                              Enviado
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right text-xs text-slate-400">{ord.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accesos Rápidos Sidebar Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Gestión Rápida de Sucursal
              </h3>

              <div className="space-y-3">
                <Link
                  to="/vendor/products"
                  className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg text-lg">
                      <FontAwesomeIcon icon={faBoxesPacking} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mis Productos</h4>
                      <p className="text-xs text-slate-400">Revisar catálogo y stock</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-slate-400 group-hover:text-amber-500 text-sm" />
                </Link>

                <Link
                  to="/vendor/warehouse"
                  className="p-4 bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-500/10 text-sky-600 rounded-lg text-lg">
                      <FontAwesomeIcon icon={faWarehouse} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Mi Almacén</h4>
                      <p className="text-xs text-slate-400">Solicitar reposición de stock</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-slate-400 group-hover:text-sky-500 text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

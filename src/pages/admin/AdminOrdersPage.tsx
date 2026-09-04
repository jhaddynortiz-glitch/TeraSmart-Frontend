import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReceipt, 
  faSpinner, 
  faEye, 
  faCheckCircle, 
  faBoxOpen, 
  faTimes,
  faUser,
  faMapMarkerAlt,
  faDollarSign,
  faClock,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';

interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  address: string;
  city: string;
  status: 'PENDIENTE' | 'EN PREPARACIÓN' | 'ENVIADO' | 'ENTREGADO';
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
}

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/orders').catch(() => apiClient.get('/orders/my-orders'));
      if (res && res.data && Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: 'PENDIENTE' | 'EN PREPARACIÓN' | 'ENVIADO' | 'ENTREGADO') => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert('Error actualizando estado de la orden: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'TODAS') return true;
    return o.status === statusFilter;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDIENTE').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faReceipt} />
            <span>Gestión Global de Órdenes de Venta</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supervisión y control de todas las transacciones realizadas por clientes en la plataforma TeraSmart.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faRefresh} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-2xl">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Ventas Totales Proyectadas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-2xl">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Órdenes Pendientes</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount} Pedidos</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-2xl">
            <FontAwesomeIcon icon={faReceipt} />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Órdenes Registradas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{orders.length} Órdenes</p>
          </div>
        </div>
      </div>

      {/* Buscador & Filtros */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <h3 className="font-bold text-slate-800 dark:text-white text-base">Listado Global de Compras</h3>

        <div className="flex flex-wrap gap-2">
          {['TODAS', 'PENDIENTE', 'EN PREPARACIÓN', 'ENVIADO', 'ENTREGADO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500 font-medium">Cargando historial de órdenes...</p>
        </div>
      )}

      {!loading && (
        <>
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <FontAwesomeIcon icon={faBoxOpen} className="text-5xl text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No hay órdenes registradas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Aún no se han generado órdenes de compra en la base de datos de la plataforma.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-4">N° Orden</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Método de Pago</th>
                      <th className="p-4">Monto Total</th>
                      <th className="p-4 text-center">Estado de Despacho</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-bold font-mono text-emerald-600 dark:text-emerald-400">{ord.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900 dark:text-white">{ord.clientName}</p>
                          <p className="text-xs text-slate-400 font-mono">{ord.clientEmail}</p>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {ord.paymentMethod || 'PAYPAL'} ({ord.paymentStatus || 'PAID'})
                        </td>
                        <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                          ${Number(ord.total || 0).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs outline-none border cursor-pointer ${
                              ord.status === 'PENDIENTE'
                                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                                : ord.status === 'EN PREPARACIÓN'
                                ? 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
                                : ord.status === 'ENVIADO'
                                ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="EN PREPARACIÓN">EN PREPARACIÓN</option>
                            <option value="ENVIADO">ENVIADO</option>
                            <option value="ENTREGADO">ENTREGADO</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 mx-auto"
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span>Detalles</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Detalle Orden Admin */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold block">
                  {selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inspección de Orden Admin</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <FontAwesomeIcon icon={faUser} className="text-emerald-500" />
                <span>{selectedOrder.clientName} ({selectedOrder.clientEmail})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sky-500" />
                <span>{selectedOrder.address}, {selectedOrder.city}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Total de la Orden</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${Number(selectedOrder.total || 0).toFixed(2)}</span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { orderService, Order } from '../../services/orderService';

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError('No se pudieron cargar tus pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando tus pedidos...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'DELIVERED': return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'CANCELLED': return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      default: return <FontAwesomeIcon icon={faClock} className="text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PROCESSING': return 'Procesando';
      case 'SHIPPED': return 'En Camino';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return status || 'Pendiente';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <div className="flex items-center space-x-3 mb-8">
        <FontAwesomeIcon icon={faBox} className="text-3xl text-sky-600 dark:text-sky-400" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Mis Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 text-center shadow-sm">
          <p className="text-slate-500 dark:text-slate-400">Aún no has realizado ningún pedido.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
              
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Orden #{order.id.substring(0, 8)}</p>
                <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {getStatusIcon(order.status || order.shippingStatus || '')}
                  <span>Estado: {getStatusText(order.status || order.shippingStatus || '')}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Fecha: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col md:items-end">
                <span className="text-xs text-slate-500 mb-1">Total Pagado</span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">${Number(order.totalAmount || order.total || 0).toFixed(2)}</span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mt-2">
                  {order.paymentMethod === 'COD' ? 'Contra Entrega' : order.paymentMethod}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

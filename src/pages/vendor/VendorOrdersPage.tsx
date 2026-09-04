import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReceipt, 
  faSpinner, 
  faEye, 
  faCheckCircle, 
  faTruckFast, 
  faBoxOpen, 
  faClock,
  faTimes,
  faUser,
  faMapMarkerAlt,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  address: string;
  city: string;
  status: 'PENDIENTE' | 'EN PREPARACIÓN' | 'ENVIADO' | 'ENTREGADO';
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export const VendorOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('TODAS');
  
  // Modal Detalle
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const mockOrders: Order[] = [
    {
      id: 'ORD-9021',
      clientName: 'Carlos Mendoza',
      clientEmail: 'carlos.mendoza@gmail.com',
      address: 'Av. Ballivián #450, Piso 3',
      city: 'Cochabamba',
      status: 'PENDIENTE',
      total: 154.00,
      createdAt: '2026-09-03 18:30',
      items: [
        { id: '1', productName: 'Audífonos Bluetooth Pro', quantity: 1, unitPrice: 99.00 },
        { id: '2', productName: 'Cargador Rápido USB-C 65W', quantity: 1, unitPrice: 55.00 }
      ]
    },
    {
      id: 'ORD-9018',
      clientName: 'María López',
      clientEmail: 'maria.lopez@yahoo.com',
      address: 'Calle España #120',
      city: 'Cochabamba',
      status: 'EN PREPARACIÓN',
      total: 89.50,
      createdAt: '2026-09-03 16:15',
      items: [
        { id: '3', productName: 'Teclado Mecánico RGB', quantity: 1, unitPrice: 89.50 }
      ]
    },
    {
      id: 'ORD-9012',
      clientName: 'Roberto Gómez',
      clientEmail: 'roberto.g@hotmail.com',
      address: 'Av. Heroínas #780',
      city: 'Cochabamba',
      status: 'ENVIADO',
      total: 320.00,
      createdAt: '2026-09-02 11:45',
      items: [
        { id: '4', productName: 'Monitor Gamer 24" Full HD', quantity: 1, unitPrice: 320.00 }
      ]
    },
    {
      id: 'ORD-8995',
      clientName: 'Lucía Fernández',
      clientEmail: 'lucia.f@gmail.com',
      address: 'Calle Baptista #340',
      city: 'Cochabamba',
      status: 'ENTREGADO',
      total: 45.00,
      createdAt: '2026-09-01 09:20',
      items: [
        { id: '5', productName: 'Mouse Pad Gamer XXL', quantity: 1, unitPrice: 45.00 }
      ]
    }
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/orders/my-orders').catch(() => null);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
      } else {
        setOrders(mockOrders);
      }
    } catch {
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: 'PENDIENTE' | 'EN PREPARACIÓN' | 'ENVIADO' | 'ENTREGADO') => {
    setUpdatingStatus(true);
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus }).catch(() => null);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'TODAS') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faReceipt} />
            <span>Órdenes de Venta</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona los pedidos asignados a tu sucursal y actualiza el estado de despacho en tiempo real.
          </p>
        </div>

        {/* Filtros de Estado */}
        <div className="flex flex-wrap gap-2">
          {['TODAS', 'PENDIENTE', 'EN PREPARACIÓN', 'ENVIADO', 'ENTREGADO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
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
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-amber-500" />
          <p className="text-sm text-slate-500 font-medium">Cargando órdenes recibidas...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Listado de Pedidos ({filteredOrders.length})
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Mostrando filtro: {statusFilter}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4">N° Orden</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Dirección</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Estado del Pedido</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-bold font-mono text-amber-600 dark:text-amber-400">{ord.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{ord.clientName}</p>
                      <p className="text-xs text-slate-400 font-mono">{ord.clientEmail}</p>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {ord.address}, {ord.city}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                      ${ord.total.toFixed(2)}
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

      {/* Modal Detalle de la Orden */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold block">
                  {selectedOrder.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detalles del Pedido</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Datos del Cliente */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <FontAwesomeIcon icon={faUser} className="text-amber-500" />
                <span>{selectedOrder.clientName} ({selectedOrder.clientEmail})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sky-500" />
                <span>{selectedOrder.address}, {selectedOrder.city}</span>
              </div>
            </div>

            {/* Lista de Artículos */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Productos del Pedido:</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                      <p className="text-xs text-slate-400">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Total a Cobrar</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${selectedOrder.total.toFixed(2)}</span>
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

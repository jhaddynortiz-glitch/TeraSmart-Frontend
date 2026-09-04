import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';
import { orderService, CheckoutRequest, CheckoutItem } from '../../services/orderService';
import { apiClient } from '../../api/axios';

export const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouseId, setWarehouseId] = useState<string>('00000000-0000-0000-0000-000000000000');

  // Datos básicos para el formulario de envío (simulado)
  const [shippingAddress, setShippingAddress] = useState('');

  // Cargar almacenes para asignar al pedido (MVP)
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const { data } = await apiClient.get('/inventory/warehouses');
        if (data && data.length > 0) {
          setWarehouseId(data[0].id); // Si hay almacenes, usamos el primero
        }
      } catch (err) {
        console.error('Error fetching warehouses:', err);
      }
    };
    fetchWarehouses();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    if (!shippingAddress.trim()) {
      setError('Por favor, ingresa una dirección de envío.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutItems: CheckoutItem[] = items.map(item => ({
        variantId: item.variantId || item.productId,
        warehouseId: warehouseId,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      const requestData: CheckoutRequest = {
        paymentMethod: 'COD',
        items: checkoutItems
      };

      await orderService.checkout(requestData);
      
      clearCart();
      setSuccess(true);
      
      // Redirigir a "Mis Órdenes" después de 3 segundos
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al procesar el pedido. Verifica el stock.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto p-4 lg:p-8 flex flex-col items-center justify-center text-center mt-10">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">¡Pedido Confirmado!</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Tu orden contra entrega ha sido registrada exitosamente. Serás redirigido a tus pedidos en breve...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Checkout</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Finaliza tu compra utilizando Pago Contra Entrega (COD)</p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Formulario */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b pb-2">1. Datos de Envío</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dirección Completa</label>
                <input 
                  type="text" 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Ej: Av. Principal 123, Zona Sur"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 border-b pb-2 mt-4">2. Método de Pago</h2>
              <div className="flex items-center p-4 border-2 border-sky-500 bg-sky-50 dark:bg-sky-900/20 rounded-xl cursor-pointer">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-sky-600 dark:text-sky-400 mr-4" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Pago Contra Entrega (COD)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pagas en efectivo al recibir tu producto.</p>
                </div>
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCheckCircle} />}
              <span>Confirmar Pedido - ${totalPrice.toFixed(2)}</span>
            </button>
          </form>

          {/* Resumen del Pedido */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 h-fit">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Resumen de tu Orden</h2>
            
            <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2 mb-6">
              {items.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No hay productos en tu carrito.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-slate-100" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                      {item.variantName && <p className="text-xs text-slate-500">{item.variantName}</p>}
                      <p className="text-sm font-medium text-sky-600 mt-1">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-medium text-slate-800 dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 dark:text-slate-400">Envío</span>
                <span className="font-medium text-green-500">Gratis</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold border-t border-slate-200 dark:border-slate-700 pt-4">
                <span className="text-slate-800 dark:text-white">Total a Pagar</span>
                <span className="text-sky-600 dark:text-sky-400">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

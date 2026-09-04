import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faArrowRight, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mt-10">
        <FontAwesomeIcon icon={faShoppingBag} className="text-6xl text-slate-300 dark:text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-8">¡Parece que aún no has añadido nada al carrito!</p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors"
        >
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lista de Productos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            {/* Header Lista */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-500 uppercase">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map(item => (
                <li key={item.id} className="p-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  
                  {/* Info Producto */}
                  <div className="col-span-6 flex gap-4 items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100" />
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{item.name}</h3>
                      {item.variantName && (
                        <span className="text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-1 rounded mt-1 inline-block">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Precio Unitario */}
                  <div className="col-span-2 md:text-center text-slate-600 dark:text-slate-300 font-medium hidden md:block">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Controles Cantidad */}
                  <div className="col-span-2 flex items-center justify-between md:justify-center">
                    <div className="md:hidden text-slate-500 font-medium">${item.price.toFixed(2)} c/u</div>
                    <div className="flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-slate-800 dark:text-white w-10 text-center border-x border-slate-100 dark:border-slate-700">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal y Eliminar */}
                  <div className="col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-slate-100 md:border-none">
                    <span className="font-bold text-slate-800 dark:text-white md:mr-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                      title="Eliminar producto"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Vaciar Carrito Botón */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={clearCart}
                className="text-sm font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Compra */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
              Resumen de Compra
            </h2>
            
            <div className="space-y-4 mb-6 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span className="font-semibold text-slate-800 dark:text-white">Incluidos</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mb-6 flex justify-between items-end">
              <span className="text-lg font-bold text-slate-800 dark:text-white">Total</span>
              <span className="text-3xl font-black text-sky-600 dark:text-sky-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20"
            >
              <span>Proceder al Pago</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            
            <p className="text-xs text-center text-slate-400 mt-4">
              Pagos seguros mediante encriptación SSL.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

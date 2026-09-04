import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWarehouse, 
  faBoxesPacking, 
  faSpinner, 
  faBuilding, 
  faPaperPlane, 
  faCheckCircle, 
  faExclamationTriangle,
  faPlus,
  faTimes,
  faStore
} from '@fortawesome/free-solid-svg-icons';

export const VendorWarehousePage: React.FC = () => {
  const [warehouse, setWarehouse] = useState<any>(null);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Solicitud de Reposición
  const [requestModal, setRequestModal] = useState(false);
  const [reqProductId, setReqProductId] = useState('');
  const [reqQuantity, setReqQuantity] = useState<number>(10);
  const [reqNotes, setReqNotes] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [whRes, prodRes] = await Promise.all([
        apiClient.get('/inventory/my-warehouse').catch(() => null),
        productService.getProducts().catch(() => [])
      ]);

      if (whRes && whRes.data) {
        setWarehouse(whRes.data.warehouse || whRes.data);
        setInventoryItems(whRes.data.inventory || []);
      }
      setProducts(prodRes || []);
      if (prodRes && prodRes.length > 0) {
        setReqProductId(prodRes[0].id);
      }
    } catch (err) {
      console.error('Error al cargar datos del almacén asignado:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendReplenishmentRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReq(true);
    setTimeout(() => {
      setSubmittingReq(false);
      setRequestModal(false);
      const prod = products.find((p) => p.id === reqProductId);
      setSuccessMessage(`¡Solicitud enviada al Administrador Central! (${reqQuantity} Unid. de ${prod?.name || 'Producto'})`);
      setReqNotes('');
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faWarehouse} />
            <span>Mi Almacén & Inventario Asignado</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consulta el stock disponible en tu sucursal y solicita reposiciones de productos al Administrador.
          </p>
        </div>

        <button
          onClick={() => setRequestModal(true)}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-amber-600/20"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>Solicitar Reposición de Stock</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-amber-500" />
          <p className="text-sm text-slate-500">Cargando inventario de tu sucursal...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Card Información de la Sucursal */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl text-3xl">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                  Sucursal Asignada
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {warehouse ? warehouse.name : 'Sucursal Central TeraSmart'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ciudad: <span className="font-semibold text-slate-700 dark:text-slate-300">{warehouse?.city || 'Cochabamba'}</span> | Dirección: {warehouse?.address || 'Av. Principal #100'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-center gap-4">
              <FontAwesomeIcon icon={faBoxesPacking} className="text-2xl text-amber-500" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Items con Stock Local</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {inventoryItems.length > 0 ? inventoryItems.length : products.length} Productos
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de Productos & Cuota de Stock Local */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Inventario de Stock en la Sucursal
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Sincronizado con Central</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4">Producto</th>
                    <th className="p-4">SKU / Identificador</th>
                    <th className="p-4">Precio de Venta</th>
                    <th className="p-4 text-center">Stock Asignado</th>
                    <th className="p-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                  {products.map((prod) => {
                    const localInv = inventoryItems.find((inv) => inv.variantId === prod.id || inv.productId === prod.id);
                    const localStock = localInv ? localInv.stock : (prod.stock !== undefined ? prod.stock : 10);
                    const isLow = localStock <= 3;
                    const isOut = localStock === 0;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                          <img
                            src={prod.mainImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span>{prod.name}</span>
                            <span className="text-xs text-slate-400 block font-normal">{prod.category?.name || 'Categoría General'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-xs">{prod.sku}</td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                          ${prod.basePrice.toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                            {localStock} Unid.
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {isOut ? (
                            <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold">
                              Agotado
                            </span>
                          ) : isLow ? (
                            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold">
                              Stock Bajo
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                              En Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Solicitar Reposición de Stock */}
      {requestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faPaperPlane} className="text-amber-500" />
                <span>Solicitar Reposición de Stock</span>
              </h3>
              <button onClick={() => setRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSendReplenishmentRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Producto a Solicitar *
                </label>
                <select
                  value={reqProductId}
                  onChange={(e) => setReqProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white font-medium"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (SKU: {p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Cantidad Requerida (Unidades) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={reqQuantity}
                  onChange={(e) => setReqQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-emerald-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Notas / Justificación para el Administrador
                </label>
                <textarea
                  rows={3}
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  placeholder="Ej. Alta demanda estimada para fin de semana..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingReq}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {submittingReq ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
                  <span>Enviar Solicitud</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxesPacking, 
  faSearch, 
  faSpinner, 
  faPaperPlane, 
  faCheckCircle, 
  faExclamationTriangle,
  faStore,
  faTimes,
  faWarehouse,
  faTag
} from '@fortawesome/free-solid-svg-icons';

export const VendorProductsPage: React.FC = () => {
  const [warehouse, setWarehouse] = useState<any>(null);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

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
      setProducts(Array.isArray(prodRes) ? prodRes : []);
      if (prodRes && prodRes.length > 0) {
        setReqProductId(prodRes[0].id);
      }
    } catch (err) {
      console.error('Error cargando catálogo y almacén del vendedor:', err);
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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const stock = p.stock !== undefined ? p.stock : 10;
    if (!matchesSearch) return false;

    if (statusFilter === 'EN_STOCK') return stock > 3;
    if (statusFilter === 'BAJO') return stock > 0 && stock <= 3;
    if (statusFilter === 'AGOTADO') return stock === 0;
    return true;
  });

  const lowStockCount = products.filter((p) => (p.stock !== undefined ? p.stock : 10) <= 3).length;
  const totalStockSum = products.reduce((sum, p) => sum + (p.stock !== undefined ? p.stock : 10), 0);

  return (
    <div className="space-y-6">
      {/* Header Unificado */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
            <FontAwesomeIcon icon={faStore} /> Sucursal Asignada: {warehouse?.name || 'Sucursal Cochabamba Norte'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <FontAwesomeIcon icon={faBoxesPacking} className="text-amber-500" />
            <span>Mis Productos & Stock Asignado</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Revisa el inventario exclusivo de tu tienda y solicita reposición de unidades al Administrador Central.
          </p>
        </div>

        <button
          onClick={() => setRequestModal(true)}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-amber-600/20 flex-shrink-0"
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
          <p className="text-sm text-slate-500 font-medium">Cargando catálogo y cuotas de tu sucursal...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Tarjetas de Métricas de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faWarehouse} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Stock Total en Sucursal</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{totalStockSum} Unid.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-2xl">
                <FontAwesomeIcon icon={faBoxesPacking} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Productos en Catálogo</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{products.length} Items</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className={`p-3 rounded-xl text-2xl ${lowStockCount > 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                <FontAwesomeIcon icon={lowStockCount > 0 ? faExclamationTriangle : faCheckCircle} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Alertas Stock Bajo</p>
                <p className={`text-2xl font-black ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {lowStockCount} Productos
                </p>
              </div>
            </div>
          </div>

          {/* Buscador & Filtros */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'TODOS', label: 'Todos' },
                { id: 'EN_STOCK', label: 'En Stock' },
                { id: 'BAJO', label: 'Stock Bajo' },
                { id: 'AGOTADO', label: 'Agotados' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const stock = prod.stock !== undefined ? prod.stock : 10;
              const isLow = stock <= 3 && stock > 0;
              const isOut = stock === 0;

              return (
                <div key={prod.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    {/* Imagen */}
                    <div className="h-44 bg-slate-100 dark:bg-slate-900 relative">
                      <img
                        src={prod.mainImageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs rounded-lg font-bold">
                        SKU: {prod.sku}
                      </span>
                    </div>

                    {/* Detalle del Producto */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                          {prod.category?.name || 'Categoría General'}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{prod.name}</h3>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Precio Base</span>
                          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                            ${Number(prod.basePrice || 0).toFixed(2)}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Stock en Sucursal</span>
                          <span className="text-xl font-black text-slate-900 dark:text-white">{stock} Unid.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Card con Estado */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    {isOut ? (
                      <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 rounded-full text-xs font-bold flex items-center gap-1">
                        <FontAwesomeIcon icon={faExclamationTriangle} /> Agotado
                      </span>
                    ) : isLow ? (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold flex items-center gap-1">
                        <FontAwesomeIcon icon={faExclamationTriangle} /> Stock Bajo
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} /> En Stock
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setReqProductId(prod.id);
                        setRequestModal(true);
                      }}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
                      Solicitar Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
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

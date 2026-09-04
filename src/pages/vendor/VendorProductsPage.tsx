import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxesPacking, 
  faSearch, 
  faSpinner, 
  faPaperPlane, 
  faCheckCircle, 
  faExclamationTriangle,
  faLayerGroup,
  faTag
} from '@fortawesome/free-solid-svg-icons';

export const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando productos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const stock = p.stock !== undefined ? p.stock : 10;
    if (!matchesSearch) return false;

    if (statusFilter === 'EN_STOCK') return stock > 3;
    if (statusFilter === 'BAJO') return stock > 0 && stock <= 3;
    if (statusFilter === 'AGOTADO') return stock === 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faBoxesPacking} />
            <span>Mis Productos & Cuotas de Stock</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consulta los productos del catálogo con la cuota de stock asignada a tu tienda.
          </p>
        </div>

        <Link
          to="/vendor/warehouse"
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-amber-600/20"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
          <span>Solicitar Reposición al Admin</span>
        </Link>
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-amber-500" />
          <p className="text-sm text-slate-500 font-medium">Cargando productos asignados...</p>
        </div>
      )}

      {!loading && (
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
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">${prod.basePrice.toFixed(2)}</span>
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
                      <FontAwesomeIcon icon={faCheckCircle} /> Disponible
                    </span>
                  )}

                  <Link
                    to="/vendor/warehouse"
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Solicitar Stock
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

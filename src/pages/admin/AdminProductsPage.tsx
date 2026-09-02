import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faSpinner, faEdit, faTrash, faBoxOpen, faRefresh, faTag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts({ search: search || undefined });
      setProducts(data);
    } catch (err: any) {
      setError('Error al cargar la lista de productos del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDeleteExecute = async () => {
    if (!confirmDeleteModal) return;
    setDeletingId(confirmDeleteModal.id);
    try {
      await productService.deleteProduct(confirmDeleteModal.id);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteModal.id));
      setConfirmDeleteModal(null);
    } catch (err: any) {
      alert('Error al eliminar el producto: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado con Botón Registrar */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Gestión Global de Productos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administración del catálogo centralizado, precios base y variantes del sistema TeraSmart.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 flex-shrink-0"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Registrar Producto</span>
        </Link>
      </div>

      {/* Buscador de Tabla */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por SKU, nombre de producto..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Estado de Carga */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando productos...</p>
        </div>
      )}

      {/* Estado de Error */}
      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 text-center space-y-3">
          <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Reintentar</span>
          </button>
        </div>
      )}

      {/* Tabla de Productos 100% Responsive */}
      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-3.5 px-4">Producto</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Categoría / Marca</th>
                    <th className="py-3.5 px-4">Precio Base</th>
                    <th className="py-3.5 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.mainImageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80'}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{prod.name}</p>
                            <p className="text-xs text-slate-400 line-clamp-1">{prod.description || 'Sin descripción'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {prod.sku}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {prod.category && (
                            <span className="inline-block text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-md">
                              {prod.category.name}
                            </span>
                          )}
                          {prod.brand && (
                            <span className="inline-block text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md ml-1">
                              {prod.brand.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        ${Number(prod.basePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/products/edit/${prod.id}`}
                            className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-sky-950/60 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Editar Producto"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                            <span>Editar</span>
                          </Link>

                          <button
                            onClick={() => setConfirmDeleteModal(prod)}
                            className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Eliminar Producto"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <FontAwesomeIcon icon={faBoxOpen} className="text-5xl text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No hay productos registrados</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Haz clic en el botón "Registrar Producto" para crear la primera publicación.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">¿Confirmar Eliminación?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              ¿Estás seguro de que deseas eliminar el producto <strong className="text-slate-900 dark:text-white">{confirmDeleteModal.name}</strong> (SKU: {confirmDeleteModal.sku})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteExecute}
                disabled={!!deletingId}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                {deletingId ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Sí, Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

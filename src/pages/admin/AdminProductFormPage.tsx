import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService, Category } from '../../services/categoryService';
import { brandService, Brand } from '../../services/brandService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faSpinner, faExclamationTriangle, faBoxArchive } from '@fortawesome/free-solid-svg-icons';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [basePrice, setBasePrice] = useState<number | string>('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSelectOptions = async () => {
      try {
        const [catData, brandData] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        setCategories(catData);
        setBrands(brandData);
      } catch (err: any) {
        console.error('Error al cargar categorías o marcas.');
      }
    };

    loadSelectOptions();

    if (isEditMode && id) {
      setFetchingProduct(true);
      productService
        .getProductById(id)
        .then((data: any) => {
          const prod = data.product || data;
          setName(prod.name || '');
          setSku(prod.sku || '');
          setBarcode(prod.barcode || '');
          setBasePrice(prod.basePrice || '');
          setCategoryId(prod.categoryId || '');
          setBrandId(prod.brandId || '');
          setMainImageUrl(prod.mainImageUrl || '');
          setDescription(prod.description || '');
        })
        .catch((err: any) => {
          setError('No se pudo cargar la información del producto para editar.');
        })
        .finally(() => setFetchingProduct(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      sku,
      barcode: barcode || undefined,
      basePrice: Number(basePrice),
      categoryId: categoryId || undefined,
      brandId: brandId || undefined,
      mainImageUrl: mainImageUrl || undefined,
      description: description || undefined
    };

    try {
      if (isEditMode && id) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Botón Volver */}
      <div>
        <Link
          to="/admin/products"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 mb-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Volver a la lista de productos</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faBoxArchive} className="text-emerald-500" />
          <span>{isEditMode ? 'Editar Producto' : 'Registrar Nuevo Producto'}</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isEditMode
            ? 'Modifica los campos del producto seleccionado y guarda los cambios.'
            : 'Completa el formulario para dar de alta un producto en el catálogo global.'}
        </p>
      </div>

      {fetchingProduct ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando datos del producto...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre del Producto */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Smartphone Samsung Galaxy S24 Ultra"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                  required
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SKU Único *
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ej. PHONE-SAMSUNG-S24U"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white font-mono"
                  required
                />
              </div>

              {/* Código de Barras */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Código de Barras (Opcional)
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Ej. 7891234567890"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white font-mono"
                />
              </div>

              {/* Precio Base */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Precio Base ($ USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="Ej. 1199.00"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white font-bold"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white font-medium"
                >
                  <option value="">-- Seleccionar Categoría --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Marca Fabricante
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white font-medium"
                >
                  <option value="">-- Seleccionar Marca --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL Imagen Principal */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Imagen Principal
                </label>
                <input
                  type="url"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escribe la descripción y características principales del producto..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:text-white"
                />
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Link
                to="/admin/products"
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    <span>{isEditMode ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { productService, Product } from '../../services/productService';
import { categoryService, Category } from '../../services/categoryService';
import { brandService, Brand } from '../../services/brandService';
import { ProductCard } from '../../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faFilter, faBoxOpen, faRefresh } from '@fortawesome/free-solid-svg-icons';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodData, catData, brandData] = await Promise.all([
        productService.getProducts({
          search: search || undefined,
          categoryId: selectedCategory || undefined,
          brandId: selectedBrand || undefined
        }),
        categoryService.getCategories(),
        brandService.getBrands()
      ]);

      setProducts(prodData);
      setCategories(catData);
      setBrands(brandData);
    } catch (err: any) {
      setError('No se pudo conectar con el servidor backend. Verifique que el servidor esté activo en http://localhost:4000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, [selectedCategory, selectedBrand]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalogData();
  };

  return (
    <div className="space-y-8">
      {/* Banner / Encabezado Principal */}
      {/* <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Plataforma E-Commerce Multivendedor
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Catálogo Oficial TeraSmart
          </h1>
          <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
            Explora nuestros productos tecnológicos y para el hogar con garantía oficial, múltiples sucursales y opciones de pago seguro.
          </p>
        </div>
      </div> */}

      {/* Barra de Filtros y Búsqueda 100% Responsive */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Buscador de Texto */}
          <div className="relative sm:col-span-2 lg:col-span-5">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, SKU o código de barras..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm dark:text-white transition-all"
            />
          </div>

          {/* Select de Categorías */}
          <div className="sm:col-span-1 lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm dark:text-white font-medium"
            >
              <option value="">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Marcas */}
          <div className="sm:col-span-1 lg:col-span-2">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none text-sm dark:text-white font-medium"
            >
              <option value="">Todas las Marcas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Filtrar */}
          <div className="sm:col-span-2 lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 px-5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <FontAwesomeIcon icon={faFilter} />
              <span>Filtrar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Estado de Carga (Loading) */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-sky-500" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cargando productos desde la API del backend...</p>
        </div>
      )}

      {/* Estado de Error */}
      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 text-center space-y-3">
          <p className="text-rose-700 dark:text-rose-300 text-sm font-medium">{error}</p>
          <button
            onClick={fetchCatalogData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Reintentar Conexión</span>
          </button>
        </div>
      )}

      {/* Grilla de Cards de Productos */}
      {!loading && !error && (
        <>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center space-y-3">
              <FontAwesomeIcon icon={faBoxOpen} className="text-5xl text-slate-300 dark:text-slate-600" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No se encontraron productos</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No hay publicaciones que coincidan con los criterios de búsqueda o filtros seleccionados.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

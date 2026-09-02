import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEye, faTag, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 flex flex-col group">
      {/* Imagen del Producto */}
      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={product.mainImageUrl || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />

        {/* Badges de Categoría y Marca */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.category && (
            <span className="text-[11px] font-semibold bg-sky-600/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm">
              {product.category.name}
            </span>
          )}
        </div>

        {product.brand && (
          <span className="absolute top-3 right-3 text-[11px] font-bold bg-slate-900/80 text-amber-300 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-sm border border-amber-400/30">
            {product.brand.name}
          </span>
        )}
      </div>

      {/* Detalle del Producto */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1.5">
            <FontAwesomeIcon icon={faTag} className="text-slate-400" />
            <span>SKU: {product.sku}</span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Precio y Variantes */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Precio Base</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${Number(product.basePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {product.variants && product.variants.length > 0 && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md flex items-center gap-1">
                <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
                {product.variants.length} Var.
              </span>
            )}
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-2">
            {/* <Link
              to={`/products/${product.id}`}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <FontAwesomeIcon icon={faEye} />
              <span>Ver Detalle</span>
            </Link> */}

            <Link
              to={`/products/${product.id}`}
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>Comprar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCartPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../context/CartContext';

// --- MOCK DATA ---
const mockProduct = {
  id: 'prod-123',
  name: 'Smartphone TeraPro Max',
  description: 'El nuevo Smartphone TeraPro Max cuenta con una pantalla OLED de 6.7", procesador de última generación y una cámara profesional de 108MP. Batería de larga duración para que nunca te quedes desconectado.',
  basePrice: 899.99,
  stock: 50,
  mainImageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  variants: [
    {
      id: 'var-1',
      variantName: 'Gris Espacial - 128GB',
      color: 'Gris',
      size: '128GB',
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'var-2',
      variantName: 'Plata - 256GB',
      color: 'Plata',
      size: '256GB',
      price: 999.99,
      imageUrl: 'https://images.unsplash.com/photo-1603184017968-953f591f8a7a?q=80&w=800&auto=format&fit=crop'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      clientId: 'user-1',
      clientName: 'María G.',
      rating: 5,
      comment: '¡Excelente teléfono! La cámara es increíble y la batería me dura todo el día sin problemas.',
      createdAt: '2026-08-20T14:30:00Z'
    },
    {
      id: 'rev-2',
      clientId: 'user-2',
      clientName: 'Juan P.',
      rating: 4,
      comment: 'Muy rápido y fluido, aunque el color plata es un poco distinto en persona.',
      createdAt: '2026-08-22T09:15:00Z'
    }
  ]
};
// -----------------

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(mockProduct.variants[0]?.id || null);

  const selectedVariant = mockProduct.variants.find(v => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : mockProduct.basePrice;
  const currentImage = selectedVariant?.imageUrl || mockProduct.mainImageUrl;

  const handleAddToCart = () => {
    addToCart({
      id: selectedVariant ? `${mockProduct.id}-${selectedVariant.id}` : mockProduct.id,
      productId: mockProduct.id,
      variantId: selectedVariant?.id,
      name: mockProduct.name,
      variantName: selectedVariant?.variantName,
      price: currentPrice,
      quantity: 1,
      imageUrl: currentImage
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-slate-500 hover:text-sky-600 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Volver
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10">
          
          {/* Imagen del Producto */}
          <div className="flex justify-center items-center bg-slate-50 dark:bg-slate-700/50 rounded-xl overflow-hidden min-h-[400px]">
            <img 
              src={currentImage} 
              alt={mockProduct.name} 
              className="w-full h-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Detalles del Producto */}
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {mockProduct.name}
            </h1>
            
            {/* Rating promedio (Mock de UI) */}
            <div className="flex items-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon 
                  key={i} 
                  icon={faStar} 
                  className={i < 4 ? "text-amber-400" : "text-slate-300 dark:text-slate-600"} 
                />
              ))}
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                (4.5 / 5 - {mockProduct.reviews.length} reseñas)
              </span>
            </div>

            <p className="text-4xl font-extrabold text-sky-600 dark:text-sky-400 mb-6">
              ${currentPrice.toFixed(2)}
            </p>

            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {mockProduct.description}
            </p>

            {/* Selector de Variantes */}
            {mockProduct.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Opciones Disponibles
                </h3>
                <div className="flex flex-wrap gap-3">
                  {mockProduct.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedVariantId === variant.id
                          ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-400 ring-2 ring-sky-500/20'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {variant.variantName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20"
              >
                <FontAwesomeIcon icon={faCartPlus} className="text-lg" />
                <span>Agregar al Carrito</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Reseñas de Clientes</h2>
        
        {mockProduct.reviews.length === 0 ? (
          <p className="text-slate-500">Aún no hay reseñas para este producto.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProduct.reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {review.clientName}
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon 
                      key={i} 
                      icon={faStar} 
                      className={i < review.rating ? "text-amber-400 text-sm" : "text-slate-200 dark:text-slate-600 text-sm"} 
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


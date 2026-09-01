import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-none transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-700/60 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-sky-600 dark:text-sky-400">Catálogo de Productos & Categorías</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explora los mejores productos y ofertas del comercio multivendedor.</p>
      </div>
    </div>
  );
};

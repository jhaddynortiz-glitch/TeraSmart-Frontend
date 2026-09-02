import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] py-8">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-md dark:shadow-none transition-colors duration-200 w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-2">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Únete a TeraSmart y empieza a comprar.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="name">
              Nombre Completo
            </label>
            <input 
              type="text" 
              id="name" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white"
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Registrarse
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

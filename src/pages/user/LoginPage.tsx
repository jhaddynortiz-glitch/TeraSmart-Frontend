import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-md dark:shadow-none transition-colors duration-200 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-2">Iniciar Sesión</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ingresa tus credenciales para acceder a TeraSmart.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-600 dark:text-slate-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded text-sky-600 focus:ring-sky-500" />
              Recordarme
            </label>
            <a href="#" className="text-sky-600 dark:text-sky-400 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

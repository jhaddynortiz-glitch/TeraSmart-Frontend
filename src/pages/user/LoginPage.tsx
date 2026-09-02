import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSpinner, faExclamationTriangle, faShieldHalved, faStore, faUser } from '@fortawesome/free-solid-svg-icons';

export const LoginPage: React.FC = () => {
  const { login, loginDevToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      redirectByRole(res.user.role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevLogin = async (devEmail: string, role: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await loginDevToken(devEmail, role);
      redirectByRole(res.user.role);
    } catch (err: any) {
      setError('Error con el token de desarrollo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectByRole = (role: string) => {
    if (role === 'SUPERADMIN') {
      navigate('/admin');
    } else if (role === 'VENDEDOR') {
      navigate('/vendor');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] py-8">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl dark:shadow-none transition-colors duration-200 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 mb-2">Iniciar Sesión</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ingresa tus credenciales para acceder a TeraSmart.</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white text-sm"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all dark:text-white text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-400 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2 shadow-md shadow-sky-600/20"
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Ingresar</span>
              </>
            )}
          </button>
        </form>

        {/* Accesos Rápidos de Prueba en 1 Clic */}
        {/* <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center mb-3">
            Acceso Rápido para Pruebas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDevLogin('admin@ecommerce.com', 'SUPERADMIN')}
              className="py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faShieldHalved} /> Admin
            </button>
            <button
              onClick={() => handleDevLogin('techstore@vendedor.com', 'VENDEDOR')}
              className="py-1.5 px-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faStore} /> Vendedor
            </button>
            <button
              onClick={() => handleDevLogin('maria.vargas@gmail.com', 'CLIENTE')}
              className="py-1.5 px-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-700/50 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faUser} /> Cliente
            </button>
          </div>
        </div> */}

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

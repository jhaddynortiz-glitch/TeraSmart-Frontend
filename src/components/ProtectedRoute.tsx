import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('CLIENTE' | 'VENDEDOR' | 'SUPERADMIN')[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Verificando sesión...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirige al login guardando la ruta a la que intentaba ir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Si el usuario está logueado pero no tiene permiso, lo mandamos al inicio
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza los children o las rutas hijas
  return children ? <>{children}</> : <Outlet />;
};

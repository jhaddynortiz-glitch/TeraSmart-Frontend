import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserShield, faStore, faUser, faSpinner, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/admin/users');
      setUsers(data);
    } catch (err: any) {
      setError('Error al cargar la lista de usuarios desde el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert('Error al actualizar rol: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} />
          <span>Gestión de Usuarios & Asignación de Roles</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administración de clientes registrados, asignación de permisos corporativos de Vendedor y SuperAdmin.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500">Cargando usuarios desde la base de datos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Rol Actual</th>
                  <th className="py-3.5 px-4">Cambiar Permiso / Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{u.name}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${u.role === 'SUPERADMIN' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : u.role === 'VENDEDOR' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

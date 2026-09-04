import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faRightLeft, faPlus, faSpinner, faBuilding, faStore, faUser, faMapMarkerAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

export const AdminTransfersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'transfers'>('warehouses');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createWhModal, setCreateWhModal] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [savingWh, setSavingWh] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [whRes, usersRes, trRes] = await Promise.all([
        apiClient.get('/inventory/warehouses'),
        apiClient.get('/admin/users').catch(() => ({ data: [] })),
        apiClient.get('/inventory/transfers').catch(() => ({ data: [] }))
      ]);

      setWarehouses(whRes.data);
      const vendorList = (usersRes.data || []).filter((u: any) => u.role === 'VENDEDOR' || u.role === 'SUPERADMIN');
      setVendors(vendorList);
      if (vendorList.length > 0 && !vendorId) {
        setVendorId(vendorList[0].id);
      }
      setTransfers(trRes.data || []);
    } catch (err: any) {
      console.error('Error al cargar datos de almacenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWh(true);
    try {
      await apiClient.post('/inventory/warehouses', {
        name,
        city,
        address,
        vendorId: vendorId || undefined
      });
      setCreateWhModal(false);
      setName('');
      setCity('');
      setAddress('');
      fetchData();
    } catch (err: any) {
      alert('Error al crear almacén: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingWh(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faWarehouse} />
            <span>Gestión de Almacenes & Sucursales</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cada sucursal o almacén está asignado a un Vendedor comercial de la plataforma.
          </p>
        </div>

        {activeTab === 'warehouses' && (
          <button
            onClick={() => setCreateWhModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Nueva Sucursal / Almacén</span>
          </button>
        )}
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-4">
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'warehouses' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FontAwesomeIcon icon={faBuilding} />
          <span>Sucursales & Vendedores ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transfers')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'transfers' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FontAwesomeIcon icon={faRightLeft} />
          <span>Transferencias de Inventario</span>
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500">Cargando sucursales y vendedores...</p>
        </div>
      )}

      {/* Pestaña 1: Almacenes con Vendedor Asignado */}
      {!loading && activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-2xl flex-shrink-0">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{wh.name}</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{wh.city || 'Sucursal Central'}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {wh.address || 'Sin dirección registrada'}
                </p>
              </div>

              {/* Vendedor Asignado */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStore} className="text-amber-500 text-sm" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Vendedor Responsable</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {wh.vendor ? wh.vendor.name : 'Sin Asignar'}
                    </span>
                  </div>
                </div>

                {wh.vendor && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700/40">
                    {wh.vendor.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pestaña 2: Transferencias */}
      {!loading && activeTab === 'transfers' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-12 text-center text-slate-500 text-sm">
          No hay transferencias de stock entre sucursales registradas actualmente.
        </div>
      )}

      {/* Modal Crear Almacén con Selección de Vendedor */}
      {createWhModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nueva Sucursal / Almacén</h3>
              <button onClick={() => setCreateWhModal(false)} className="text-slate-400 hover:text-slate-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleCreateWarehouse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nombre de la Sucursal / Almacén *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sucursal Cochabamba Norte"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Vendedor Responsable *
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white font-medium"
                  required
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.email}) - {v.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Ciudad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Cochabamba"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Dirección</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej. Av. Ballivián 789"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateWhModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingWh}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {savingWh ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
                  <span>Guardar Sucursal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

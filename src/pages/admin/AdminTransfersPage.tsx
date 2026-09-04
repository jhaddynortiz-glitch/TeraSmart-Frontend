import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faRightLeft, faPlus, faSpinner, faBuilding, faBoxesPacking, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

export const AdminTransfersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'warehouses' | 'transfers'>('warehouses');
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createWhModal, setCreateWhModal] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [whRes, trRes] = await Promise.all([
        apiClient.get('/inventory/warehouses'),
        apiClient.get('/inventory/transfers').catch(() => ({ data: [] }))
      ]);
      setWarehouses(whRes.data);
      setTransfers(trRes.data || []);
    } catch (err: any) {
      console.error('Error al cargar almacenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/inventory/warehouses', { name, city, address });
      setCreateWhModal(false);
      setName('');
      setCity('');
      setAddress('');
      fetchData();
    } catch (err: any) {
      alert('Error al crear almacén: ' + (err.response?.data?.message || err.message));
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
            Administración de almacenes físicos de sucursal y monitoreo de transferencias de inventario.
          </p>
        </div>

        {activeTab === 'warehouses' && (
          <button
            onClick={() => setCreateWhModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Nuevo Almacén</span>
          </button>
        )}
      </div>

      {/* Pestañas (Tabs) */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-4">
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'warehouses' ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <FontAwesomeIcon icon={faBuilding} />
          <span>Sucursales & Almacenes ({warehouses.length})</span>
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
          <p className="text-sm text-slate-500">Cargando datos del inventario...</p>
        </div>
      )}

      {/* Pestaña 1: Almacenes */}
      {!loading && activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((wh) => (
            <div key={wh.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xl">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{wh.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{wh.city || 'Central'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{wh.address || 'Dirección de sucursal registrada'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pestaña 2: Transferencias */}
      {!loading && activeTab === 'transfers' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 text-center text-slate-500 text-sm">
          No hay transferencias de stock registradas actualmente.
        </div>
      )}

      {/* Modal Crear Almacén */}
      {createWhModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nuevo Almacén</h3>
            <form onSubmit={handleCreateWarehouse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nombre del Almacén *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Almacén Zona Sur" className="w-full px-3 py-2 border rounded-xl text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Ciudad</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ej. Cochabamba" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Dirección</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej. Av. Heroínas 456" className="w-full px-3 py-2 border rounded-xl text-sm" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateWhModal(false)} className="px-4 py-2 bg-slate-100 text-xs font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">Guardar Almacén</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

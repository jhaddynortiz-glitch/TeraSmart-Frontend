import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/axios';
import { productService, Product } from '../../services/productService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWarehouse, 
  faPlus, 
  faSpinner, 
  faBuilding, 
  faStore, 
  faBoxesPacking, 
  faChartPie, 
  faSave, 
  faCheckCircle, 
  faExclamationTriangle, 
  faTimes,
  faChevronDown,
  faChevronUp,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';

export const AdminTransfersPage: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Estados de Distribución de Stock
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [allocations, setAllocations] = useState<{ [warehouseId: string]: number }>({});
  const [savingDistribution, setSavingDistribution] = useState(false);
  const [distributionSuccess, setDistributionSuccess] = useState<string | null>(null);

  // Acordeón/Toggle de Lista de Sucursales
  const [showWarehouseList, setShowWarehouseList] = useState(false);

  // Modal Crear Almacén
  const [createWhModal, setCreateWhModal] = useState(false);
  const [whName, setWhName] = useState('');
  const [whCity, setWhCity] = useState('');
  const [whAddress, setWhAddress] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [savingWh, setSavingWh] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [whRes, usersRes, prodRes] = await Promise.all([
        apiClient.get('/inventory/warehouses').catch((err) => {
          console.warn('Error cargando almacenes:', err);
          return { data: [] };
        }),
        apiClient.get('/admin/users').catch((err) => {
          console.warn('Error cargando usuarios:', err);
          return { data: [] };
        }),
        productService.getProducts().catch((err) => {
          console.warn('Error cargando productos:', err);
          return [];
        })
      ]);

      const whList = Array.isArray(whRes.data) ? whRes.data : [];
      setWarehouses(whList);

      const userList = Array.isArray(usersRes.data) ? usersRes.data : [];
      const vendorList = userList.filter((u: any) => u.role === 'VENDEDOR' || u.role === 'SUPERADMIN');
      setVendors(vendorList);
      if (vendorList.length > 0 && !vendorId) {
        setVendorId(vendorList[0].id);
      }

      const productList = Array.isArray(prodRes) ? prodRes : [];
      setProducts(productList);
      if (productList.length > 0) {
        setSelectedProductId((prev) => (prev ? prev : productList[0].id));
      }
    } catch (err: any) {
      console.error('Error general al cargar datos de almacenes:', err);
      setFetchError('Hubo un inconveniente al sincronizar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cargar cuotas de distribución guardadas cuando cambia el producto seleccionado
  useEffect(() => {
    if (!selectedProductId) return;
    const fetchDistribution = async () => {
      try {
        const res = await apiClient.get(`/inventory/product-distribution/${selectedProductId}`);
        if (res.data && res.data.allocations) {
          setAllocations(res.data.allocations);
        } else {
          setAllocations({});
        }
      } catch (e) {
        setAllocations({});
      }
    };
    fetchDistribution();
  }, [selectedProductId]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const totalGeneralStock = selectedProduct ? (selectedProduct.stock !== undefined ? selectedProduct.stock : 10) : 0;
  const totalDistributedStock = Object.values(allocations).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const unassignedReserve = totalGeneralStock - totalDistributedStock;

  const handleStockChange = (warehouseId: string, val: string) => {
    const qty = parseInt(val) || 0;
    setAllocations((prev) => ({
      ...prev,
      [warehouseId]: qty
    }));
  };

  const handleSaveDistribution = async () => {
    if (!selectedProductId) return;
    if (totalDistributedStock > totalGeneralStock) {
      alert(`⚠️ La suma asignada (${totalDistributedStock}) supera el Stock General del Producto (${totalGeneralStock}). Ajusta las cantidades.`);
      return;
    }

    setSavingDistribution(true);
    setDistributionSuccess(null);

    const payload = {
      productId: selectedProductId,
      allocations: Object.entries(allocations).map(([whId, qty]) => ({
        warehouseId: whId,
        stock: qty
      }))
    };

    try {
      await apiClient.put('/inventory/stock-distribution', payload);
      setDistributionSuccess(`¡Distribución de stock guardada con éxito para "${selectedProduct?.name}"!`);
      setTimeout(() => setDistributionSuccess(null), 4000);
    } catch (err: any) {
      alert('Error al guardar distribución: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingDistribution(false);
    }
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWh(true);
    try {
      await apiClient.post('/inventory/warehouses', {
        name: whName,
        city: whCity,
        address: whAddress,
        vendorId: vendorId || undefined
      });
      setCreateWhModal(false);
      setWhName('');
      setWhCity('');
      setWhAddress('');
      fetchData();
    } catch (err: any) {
      alert('Error al crear almacén: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingWh(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <FontAwesomeIcon icon={faWarehouse} />
            <span>Gestión de Almacenes & Distribución de Stock</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Asigna y reparte el stock general de cada producto a los almacenes y vendedores de la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Recargar catálogo y sucursales"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
          >
            <FontAwesomeIcon icon={faRefresh} />
          </button>
          <button
            onClick={() => setCreateWhModal(true)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Crear Nueva Sucursal</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-emerald-500" />
          <p className="text-sm text-slate-500 font-medium">Cargando catálogo de productos y sucursales...</p>
        </div>
      )}

      {fetchError && !loading && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-2xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 text-lg" />
            <span>{fetchError}</span>
          </div>
          <button onClick={fetchData} className="px-3 py-1 bg-amber-200 dark:bg-amber-800 font-bold rounded-lg text-xs">
            Reintentar
          </button>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* SECCIÓN 1: Selección del Producto */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
              Seleccionar Producto del Catálogo para Distribuir *
            </label>
            {products.length === 0 ? (
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                ⚠️ No se encontraron productos en el catálogo. Registra productos en la pestaña "Gestión de Productos" para comenzar a asignar stock.
              </p>
            ) : (
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setAllocations({});
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-base outline-none dark:text-white"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} (SKU: {prod.sku}) — Stock General: {prod.stock !== undefined ? prod.stock : 10} Unid.
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* SECCIÓN 2: Métricas de Distribución */}
          {selectedProduct && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-xl text-2xl">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Stock General Registrado</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{totalGeneralStock} Unid.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-2xl">
                  <FontAwesomeIcon icon={faBoxesPacking} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Stock Asignado a Vendedores</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalDistributedStock} Unid.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className={`p-3 rounded-xl text-2xl ${unassignedReserve < 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  <FontAwesomeIcon icon={unassignedReserve < 0 ? faExclamationTriangle : faCheckCircle} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">Reserva Central (Sin Asignar)</p>
                  <p className={`text-2xl font-black ${unassignedReserve < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {unassignedReserve} Unid.
                  </p>
                </div>
              </div>
            </div>
          )}

          {distributionSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-emerald-500" />
              <span>{distributionSuccess}</span>
            </div>
          )}

          {/* SECCIÓN 3: Tabla de Reparto de Cuotas por Sucursal/Vendedor */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Reparto de Cuotas por Sucursal y Vendedor Responsable
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{warehouses.length} Sucursales activas</span>
            </div>

            {warehouses.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-sm text-slate-500 font-semibold">No hay sucursales registradas aún.</p>
                <button
                  onClick={() => setCreateWhModal(true)}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                  Crear Primera Sucursal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {warehouses.map((wh) => (
                  <div key={wh.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg text-xl">
                        <FontAwesomeIcon icon={faStore} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{wh.name}</p>
                        <p className="text-xs text-slate-400 font-medium">
                          Vendedor: <span className="text-slate-700 dark:text-slate-300 font-semibold">{wh.vendor ? wh.vendor.name : 'Sin Vendedor'}</span> ({wh.city || 'Central'})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Asignar Stock:</span>
                      <input
                        type="number"
                        min="0"
                        value={allocations[wh.id] !== undefined ? allocations[wh.id] : 0}
                        onChange={(e) => handleStockChange(wh.id, e.target.value)}
                        placeholder="0"
                        className="w-28 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-emerald-600 text-sm text-center outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-slate-400 font-semibold">Unid.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {warehouses.length > 0 && selectedProduct && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={handleSaveDistribution}
                  disabled={savingDistribution || totalDistributedStock > totalGeneralStock}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {savingDistribution ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                  <span>Guardar Distribución de Stock</span>
                </button>
              </div>
            )}
          </div>

          {/* SECCIÓN 4: Acordeón opcional para consultar detalles de las Sucursales */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            <button
              onClick={() => setShowWarehouseList(!showWarehouseList)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Directorio de Sucursales y Almacenes Registrados ({warehouses.length})
                </h3>
              </div>
              <FontAwesomeIcon icon={showWarehouseList ? faChevronUp : faChevronDown} className="text-slate-400 text-sm" />
            </button>

            {showWarehouseList && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                {warehouses.map((wh) => (
                  <div key={wh.id} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{wh.name}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        {wh.city || 'Central'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{wh.address || 'Sin dirección'}</p>
                    <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                      Vendedor: <span className="font-semibold">{wh.vendor ? wh.vendor.name : 'Sin Asignar'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear Almacén */}
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
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
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
                  value={whCity}
                  onChange={(e) => setWhCity(e.target.value)}
                  placeholder="Ej. Cochabamba"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">Dirección</label>
                <input
                  type="text"
                  value={whAddress}
                  onChange={(e) => setWhAddress(e.target.value)}
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

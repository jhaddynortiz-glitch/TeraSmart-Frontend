import { apiClient } from '../api/axios';

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
  city?: string;
  vendorId?: string;
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  variantId: string;
  stock: number;
  variant?: any;
}

export interface StockTransferRequest {
  originWarehouseId: string;
  destWarehouseId: string;
  variantId: string;
  quantity: number;
}

export const inventoryService = {
  async getWarehouses(): Promise<Warehouse[]> {
    const { data } = await apiClient.get<Warehouse[]>('/inventory/warehouses');
    return data;
  },

  async getMyWarehouse(): Promise<{ warehouse: Warehouse; inventory: InventoryItem[] }> {
    const { data } = await apiClient.get<{ warehouse: Warehouse; inventory: InventoryItem[] }>('/inventory/my-warehouse');
    return data;
  },

  async updateStock(warehouseId: string, variantId: string, stock: number): Promise<{ message: string; inventory: InventoryItem }> {
    const { data } = await apiClient.put('/inventory/stock', { warehouseId, variantId, stock });
    return data;
  },

  async transferStock(transferData: StockTransferRequest): Promise<{ message: string; transfer: any }> {
    const { data } = await apiClient.post('/inventory/transfers', transferData);
    return data;
  }
};

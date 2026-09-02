import { apiClient } from '../api/axios';

export interface CheckoutItem {
  variantId: string;
  warehouseId: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutRequest {
  paymentMethod: 'PAYPAL' | 'COD';
  items: CheckoutItem[];
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items?: any[];
}

export const orderService = {
  async checkout(checkoutData: CheckoutRequest): Promise<{ message: string; order: Order }> {
    const { data } = await apiClient.post('/orders/checkout', checkoutData);
    return data;
  },

  async getMyOrders(): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>('/orders/my-orders');
    return data;
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`/orders/${id}`);
    return data;
  }
};

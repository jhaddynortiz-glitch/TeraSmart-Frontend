import { apiClient } from '../api/axios';

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  variantName: string;
  color?: string;
  size?: string;
  attributesJson?: Record<string, any>;
  price: number;
  imageUrl?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: { name: string; email: string };
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  slug?: string;
  name: string;
  description?: string;
  basePrice: number;
  weightKg?: number;
  mainImageUrl?: string;
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface ProductFilterParams {
  categoryId?: string;
  brandId?: string;
  sku?: string;
  search?: string;
}

export const productService = {
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>('/products', { params });
    return data;
  },

  async getProductById(id: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const { data } = await apiClient.post<Product>('/products', productData);
    return data;
  },

  async addVariant(productId: string, variantData: Partial<ProductVariant>): Promise<ProductVariant> {
    const { data } = await apiClient.post<ProductVariant>(`/products/${productId}/variants`, variantData);
    return data;
  },

  async addReview(productId: string, rating: number, comment: string): Promise<Review> {
    const { data } = await apiClient.post<Review>(`/products/${productId}/reviews`, { rating, comment });
    return data;
  }
};

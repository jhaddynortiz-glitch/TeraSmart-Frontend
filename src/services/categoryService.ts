import { apiClient } from '../api/axios';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const { data } = await apiClient.post<Category>('/categories', categoryData);
    return data;
  }
};

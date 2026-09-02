import { apiClient } from '../api/axios';

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    const { data } = await apiClient.get<Brand[]>('/brands');
    return data;
  },

  async createBrand(brandData: Partial<Brand>): Promise<Brand> {
    const { data } = await apiClient.post<Brand>('/brands', brandData);
    return data;
  }
};

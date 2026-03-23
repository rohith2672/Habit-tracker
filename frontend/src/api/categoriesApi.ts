import axiosInstance from './axiosInstance';
import type { Category } from './types';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await axiosInstance.get('/categories');
    return res.data;
  },

  create: async (name: string): Promise<Category> => {
    const res = await axiosInstance.post('/categories', { name });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },
};

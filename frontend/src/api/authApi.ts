import axiosInstance from './axiosInstance';
import type { AuthResponse, User } from './types';

export const authApi = {
  register: async (data: { email: string; username: string; password: string }): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/login', data);
    return res.data;
  },

  me: async (): Promise<User> => {
    const res = await axiosInstance.get('/auth/me');
    return res.data;
  },
};

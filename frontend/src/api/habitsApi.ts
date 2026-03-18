import axiosInstance from './axiosInstance';
import type { Habit, HabitRequest, HabitStats, DashboardData, MonthHistory } from './types';

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const res = await axiosInstance.get('/habits');
    return res.data;
  },

  getOne: async (id: number): Promise<Habit> => {
    const res = await axiosInstance.get(`/habits/${id}`);
    return res.data;
  },

  create: async (data: HabitRequest): Promise<Habit> => {
    const res = await axiosInstance.post('/habits', data);
    return res.data;
  },

  update: async (id: number, data: HabitRequest): Promise<Habit> => {
    const res = await axiosInstance.put(`/habits/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/habits/${id}`);
  },

  getStats: async (id: number): Promise<HabitStats> => {
    const res = await axiosInstance.get(`/habits/${id}/stats`);
    return res.data;
  },

  checkIn: async (id: number, note?: string): Promise<void> => {
    await axiosInstance.post(`/habits/${id}/checkin`, { note });
  },

  undoCheckIn: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/habits/${id}/checkin`);
  },

  getHistory: async (id: number, year: number, month: number): Promise<MonthHistory> => {
    const res = await axiosInstance.get(`/habits/${id}/history`, { params: { year, month } });
    return res.data;
  },

  getDashboard: async (): Promise<DashboardData> => {
    const res = await axiosInstance.get('/dashboard');
    return res.data;
  },
};

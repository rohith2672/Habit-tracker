import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '../api/habitsApi';
import type { HabitRequest } from '../api/types';
import toast from 'react-hot-toast';

export const useHabits = () => {
  return useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
  });
};

export const useHabit = (id: number) => {
  return useQuery({
    queryKey: ['habits', id],
    queryFn: () => habitsApi.getOne(id),
    enabled: !!id,
  });
};

export const useHabitStats = (id: number) => {
  return useQuery({
    queryKey: ['habits', id, 'stats'],
    queryFn: () => habitsApi.getStats(id),
    enabled: !!id,
  });
};

export const useHabitHistory = (id: number, year: number, month: number) => {
  return useQuery({
    queryKey: ['habits', id, 'history', year, month],
    queryFn: () => habitsApi.getHistory(id, year, month),
    enabled: !!id,
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: habitsApi.getDashboard,
  });
};

export const useCreateHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: HabitRequest) => habitsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Habit created!');
    },
    onError: () => toast.error('Failed to create habit'),
  });
};

export const useUpdateHabit = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: HabitRequest) => habitsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Habit updated!');
    },
    onError: () => toast.error('Failed to update habit'),
  });
};

export const useDeleteHabit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => habitsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Habit deleted');
    },
    onError: () => toast.error('Failed to delete habit'),
  });
};

export const useCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: number; note?: string }) => habitsApi.checkIn(id, note),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['habits', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast.error('Check-in failed'),
  });
};

export const useUndoCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => habitsApi.undoCheckIn(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ['habits'] });
      qc.invalidateQueries({ queryKey: ['habits', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast.error('Undo failed'),
  });
};

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, CheckCircle2, ListChecks, Flame } from 'lucide-react';
import { useDashboard } from '../hooks/useHabits';
import { HabitList } from '../components/habits/HabitList';
import { HabitForm } from '../components/habits/HabitForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ProgressBar } from '../components/dashboard/ProgressBar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Habit } from '../api/types';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useDashboard();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHabit(undefined);
  };

  const topStreak = data?.habits.reduce((max, h) => Math.max(max, h.currentStreak), 0) ?? 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={16} /> New habit
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatsCard
              label="Total habits"
              value={data?.totalHabits ?? 0}
              icon={<ListChecks size={18} />}
            />
            <StatsCard
              label="Done today"
              value={`${data?.completedToday ?? 0}/${data?.totalHabits ?? 0}`}
              icon={<CheckCircle2 size={18} />}
            />
            <StatsCard
              label="Top streak"
              value={topStreak}
              sub={topStreak === 1 ? 'day' : 'days'}
              icon={<Flame size={18} />}
            />
          </div>

          {/* Progress */}
          {(data?.totalHabits ?? 0) > 0 && (
            <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-300 mb-3">Today's progress</p>
              <ProgressBar
                value={data?.completedToday ?? 0}
                max={data?.totalHabits ?? 1}
                label={`${data?.completedToday} of ${data?.totalHabits} habits completed`}
              />
            </div>
          )}

          {/* Habits */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Your habits
            </h2>
            <HabitList habits={data?.habits ?? []} onEdit={handleEdit} />
          </div>
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingHabit ? 'Edit habit' : 'New habit'}
      >
        <HabitForm habit={editingHabit} onSuccess={handleCloseModal} />
      </Modal>
    </div>
  );
};

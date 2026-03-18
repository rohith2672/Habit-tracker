import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowLeft, Pencil } from 'lucide-react';
import { useHabitStats, useHabitHistory, useCheckIn, useUndoCheckIn } from '../hooks/useHabits';
import { useQuery } from '@tanstack/react-query';
import { habitsApi } from '../api/habitsApi';
import { CalendarGrid } from '../components/habits/CalendarGrid';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { HabitForm } from '../components/habits/HabitForm';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Flame, Trophy, BarChart2, CheckCircle2 } from 'lucide-react';

export const HabitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const habitId = parseInt(id!, 10);
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [editOpen, setEditOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: habit, isLoading: habitLoading } = useQuery({
    queryKey: ['habits', habitId],
    queryFn: () => habitsApi.getOne(habitId),
    enabled: !!habitId,
  });

  const { data: stats } = useHabitStats(habitId);
  const { data: history = {} } = useHabitHistory(habitId, year, month);

  const checkIn = useCheckIn();
  const undoCheckIn = useUndoCheckIn();

  if (habitLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="p-6 text-center text-gray-500">Habit not found</div>
    );
  }

  const handleToggle = () => {
    if (habit.completedToday) {
      undoCheckIn.mutate(habitId);
    } else {
      checkIn.mutate({ id: habitId });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: habit.color }}
        />
        <h1 className="text-xl font-bold text-gray-100 flex-1">{habit.name}</h1>
        <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil size={15} /> Edit
        </Button>
      </div>

      {habit.description && (
        <p className="text-gray-500 text-sm mb-6">{habit.description}</p>
      )}

      {/* Check-in button */}
      <button
        onClick={handleToggle}
        disabled={checkIn.isPending || undoCheckIn.isPending}
        className={`
          w-full py-3 rounded-xl font-semibold text-sm transition-all mb-6
          ${habit.completedToday
            ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}
        `}
      >
        {habit.completedToday ? '✓ Completed today — Click to undo' : 'Mark as done today'}
      </button>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatsCard label="Current streak" value={stats.currentStreak} sub="days" icon={<Flame size={18} />} />
          <StatsCard label="Longest streak" value={stats.longestStreak} sub="days" icon={<Trophy size={18} />} />
          <StatsCard label="Completion rate" value={`${stats.completionRate}%`} icon={<BarChart2 size={18} />} />
          <StatsCard label="Total check-ins" value={stats.totalCompletions} icon={<CheckCircle2 size={18} />} />
        </div>
      )}

      {/* Calendar */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentDate(d => subMonths(d, 1))}
              className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(d => addMonths(d, 1))}
              className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <CalendarGrid year={year} month={month} history={history} color={habit.color} />
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit habit">
        <HabitForm habit={habit} onSuccess={() => setEditOpen(false)} />
      </Modal>
    </div>
  );
};

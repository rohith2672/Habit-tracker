import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Habit } from '../../api/types';
import { useCheckIn, useUndoCheckIn, useDeleteHabit } from '../../hooks/useHabits';
import { StreakBadge } from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit }) => {
  const navigate = useNavigate();
  const checkIn = useCheckIn();
  const undoCheckIn = useUndoCheckIn();
  const deleteHabit = useDeleteHabit();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (habit.completedToday) {
      undoCheckIn.mutate(habit.id);
    } else {
      checkIn.mutate({ id: habit.id });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    deleteHabit.mutate(habit.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(habit);
  };

  return (
    <div
      onClick={() => navigate(`/habits/${habit.id}`)}
      className="group relative bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-700 transition-all"
    >
      <div className="flex items-start gap-3">
        {/* Color dot */}
        <div
          className="mt-0.5 w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: habit.color }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-100 truncate">{habit.name}</h3>
            <StreakBadge streak={habit.currentStreak} />
          </div>
          {habit.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{habit.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Check-in button */}
          <button
            onClick={handleToggle}
            disabled={checkIn.isPending || undoCheckIn.isPending}
            className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
              ${habit.completedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-600 text-transparent hover:border-green-500 hover:text-green-500'}
            `}
          >
            <Check size={14} strokeWidth={3} />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-10 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 w-36"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    deleteConfirm ? 'text-red-400 bg-red-900/20' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Trash2 size={14} />
                  {deleteConfirm ? 'Confirm delete' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

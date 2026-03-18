import React from 'react';
import type { Habit } from '../../api/types';
import { HabitCard } from './HabitCard';
import { ListChecks } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onEdit }) => {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ListChecks size={48} className="text-gray-700 mb-4" />
        <p className="text-gray-400 font-medium">No habits yet</p>
        <p className="text-gray-600 text-sm mt-1">Create your first habit to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
      ))}
    </div>
  );
};

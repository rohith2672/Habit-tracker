import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Habit } from '../../api/types';
import { HabitCard } from './HabitCard';

interface CompletedSectionProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
}

export const CompletedSection: React.FC<CompletedSectionProps> = ({ habits, onEdit }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 hover:text-gray-200 transition-colors"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Completed today ({habits.length})
      </button>
      {open && (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

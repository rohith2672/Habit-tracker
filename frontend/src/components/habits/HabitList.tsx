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

  // Group by category; null/blank → 'Uncategorized'
  const grouped = new Map<string, Habit[]>();
  for (const habit of habits) {
    const key = habit.category?.trim() || 'Uncategorized';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(habit);
  }

  // Named categories alphabetically first, 'Uncategorized' last
  const namedKeys = Array.from(grouped.keys())
    .filter((k) => k !== 'Uncategorized')
    .sort((a, b) => a.localeCompare(b));
  const allKeys = grouped.has('Uncategorized')
    ? [...namedKeys, 'Uncategorized']
    : namedKeys;

  // If all habits are uncategorized, render flat (no heading)
  const showHeadings = namedKeys.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {allKeys.map((key) => (
        <div key={key}>
          {showHeadings && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {key}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {grouped.get(key)!.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

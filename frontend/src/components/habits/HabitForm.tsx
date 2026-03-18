import React, { useEffect } from 'react';
import type { Habit, HabitRequest } from '../../api/types';
import { useCreateHabit, useUpdateHabit } from '../../hooks/useHabits';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
];

interface HabitFormProps {
  habit?: Habit;
  onSuccess: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSuccess }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [color, setColor] = React.useState('#6366f1');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit(habit?.id ?? 0);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description ?? '');
      setColor(habit.color);
    }
  }, [habit]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    else if (name.length > 100) errs.name = 'Max 100 characters';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const data: HabitRequest = { name: name.trim(), description: description.trim() || undefined, color };

    if (habit) {
      updateHabit.mutate(data, { onSuccess });
    } else {
      createHabit.mutate(data, { onSuccess });
    }
  };

  const isPending = createHabit.isPending || updateHabit.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Habit name"
        placeholder="e.g., Morning run"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this habit about?"
          rows={2}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                color === c ? 'border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={isPending}>
          {habit ? 'Save changes' : 'Create habit'}
        </Button>
      </div>
    </form>
  );
};

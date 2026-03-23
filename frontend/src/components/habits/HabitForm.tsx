import React, { useEffect } from 'react';
import type { Habit, HabitRequest } from '../../api/types';
import { useCreateHabit, useUpdateHabit } from '../../hooks/useHabits';
import { useCategories, useCreateCategory } from '../../hooks/useCategories';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  frequencyToPreset,
  buildFrequency,
  type FrequencyPreset,
  type DayName,
} from '../../utils/frequency';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
];

const DAY_LABELS: { key: DayName; label: string }[] = [
  { key: 'MONDAY', label: 'Mon' },
  { key: 'TUESDAY', label: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wed' },
  { key: 'THURSDAY', label: 'Thu' },
  { key: 'FRIDAY', label: 'Fri' },
  { key: 'SATURDAY', label: 'Sat' },
  { key: 'SUNDAY', label: 'Sun' },
];

interface HabitFormProps {
  habit?: Habit;
  onSuccess: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ habit, onSuccess }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [color, setColor] = React.useState('#6366f1');
  const [preset, setPreset] = React.useState<FrequencyPreset>('daily');
  const [customDays, setCustomDays] = React.useState<DayName[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [showNewCategory, setShowNewCategory] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit(habit?.id ?? 0);
  const { data: categories = [] } = useCategories();
  const createCategory = useCreateCategory();

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description ?? '');
      setColor(habit.color);
      const p = frequencyToPreset(habit.frequency ?? 'daily');
      setPreset(p);
      if (p === 'custom') {
        setCustomDays((habit.frequency ?? '').split(',').map((d) => d.trim() as DayName));
      }
      setSelectedCategory(habit.category ?? undefined);
    }
  }, [habit]);

  const toggleCustomDay = (day: DayName) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    try {
      const created = await createCategory.mutateAsync(trimmed);
      setSelectedCategory(created.name);
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch {
      // category may already exist; just select by name
      setSelectedCategory(trimmed);
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    else if (name.length > 100) errs.name = 'Max 100 characters';
    if (preset === 'custom' && customDays.length === 0) {
      errs.frequency = 'Pick at least one day';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const frequency = buildFrequency(preset, customDays);
    const data: HabitRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      frequency,
      category: selectedCategory || undefined,
    };

    if (habit) {
      updateHabit.mutate(data, { onSuccess });
    } else {
      createHabit.mutate(data, { onSuccess });
    }
  };

  const isPending = createHabit.isPending || updateHabit.isPending;

  const presetButtons: { key: FrequencyPreset; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekdays', label: 'Weekdays' },
    { key: 'weekends', label: 'Weekends' },
    { key: 'custom', label: 'Custom' },
  ];

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

      {/* Frequency */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Frequency</label>
        <div className="flex gap-2 flex-wrap">
          {presetButtons.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreset(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                preset === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {preset === 'custom' && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {DAY_LABELS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleCustomDay(key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  customDays.includes(key)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        {errors.frequency && (
          <p className="text-xs text-red-400">{errors.frequency}</p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">Category</label>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            type="button"
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === undefined
                ? 'bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            None
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {showNewCategory ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }
                  if (e.key === 'Escape') { setShowNewCategory(false); setNewCategoryName(''); }
                }}
                placeholder="Category name"
                className="px-2 py-1 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
            >
              + New
            </button>
          )}
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

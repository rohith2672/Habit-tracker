import React from 'react';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  format, isToday
} from 'date-fns';
import type { MonthHistory } from '../../api/types';

interface CalendarGridProps {
  year: number;
  month: number;
  history: MonthHistory;
  color?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({ year, month, history, color = '#6366f1' }) => {
  const monthDate = new Date(year, month - 1, 1);
  const days = eachDayOfInterval({ start: startOfMonth(monthDate), end: endOfMonth(monthDate) });
  const startPad = getDay(days[0]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-600 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const done = !!history[key];
          const today = isToday(day);

          return (
            <div
              key={key}
              title={key}
              className={`
                aspect-square rounded-md flex items-center justify-center text-xs font-medium
                ${done ? 'text-white' : today ? 'text-gray-100 border border-gray-600' : 'text-gray-600'}
                ${!done && !today ? 'bg-gray-800/50' : ''}
              `}
              style={done ? { backgroundColor: color } : undefined}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

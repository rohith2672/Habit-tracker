import React from 'react';
import { Card } from '../ui/Card';

interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, sub, icon }) => {
  return (
    <Card className="flex items-start gap-3">
      {icon && (
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-100 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
};

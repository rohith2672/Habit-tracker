export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  username: string;
  userId: number;
}

export interface Habit {
  id: number;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  frequency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  completedToday: boolean;
  currentStreak: number;
}

export interface HabitRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: string;
}

export interface HabitStats {
  habitId: number;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  completedToday: boolean;
}

export interface DashboardData {
  habits: Habit[];
  totalHabits: number;
  completedToday: number;
  completionRate: number;
}

export interface MonthHistory {
  [date: string]: boolean;
}

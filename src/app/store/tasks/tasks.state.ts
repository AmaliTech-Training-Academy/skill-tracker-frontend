export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  duration: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  dateAssigned?: string;
}

export interface TasksState {
  todayTasks: Task[];
  previousTasks: Task[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
}

export const initialTasksState: TasksState = {
  todayTasks: [],
  previousTasks: [],
  loading: false,
  error: null,
  selectedCategory: 'HTML',
};

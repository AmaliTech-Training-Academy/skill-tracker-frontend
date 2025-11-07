import { Task } from '@app/core/models/tasks-model';

export interface TasksState {
  todayTasks: Task[];
  previousTasks: Task[];
  skills: string[];
  selectedSkill: string;
  timeRanges: string[];
  selectedTimeRange: string;
  loading: boolean;
  error: string | null;
}

export const initialTasksState: TasksState = {
  todayTasks: [
    {
      id: 't1',
      title: 'Fix The Print Statement',
      icon: 'abc',
      description: 'Assess your knowledge in this skill area.',
      skill: 'HTML',
      difficulty: 'Beginner',
      xp: 0,
      time: '15 min',
      status: 'Pending',
    },
    {
      id: 't2',
      title: 'Concept Explanation',
      icon: 'pencil',
      description: 'Explain a key concept in your own words.',
      skill: 'Data Structures',
      difficulty: 'Beginner',
      xp: 0,
      time: '15 min',
      status: 'Pending',
    },
  ],
  previousTasks: [
    {
      id: 'p1',
      title: 'Skill Assessment',
      icon: 'abc',
      description: 'Assess your knowledge in this skill area.',
      skill: 'Data Structures',
      difficulty: 'Beginner',
      xp: 50,
      time: '15 min',
      status: 'Completed',
    },
    {
      id: 'p2',
      title: 'Skill Assessment',
      icon: 'abc',
      description: 'Assess your knowledge in this skill area.',
      skill: 'Data Structures',
      difficulty: 'Beginner',
      xp: 50,
      time: '15 min',
      status: 'Completed',
    },
  ],
  skills: ['All Skills', 'HTML', 'CSS', 'UI/UX Design', 'Data Structures'],
  timeRanges: ['All Periods', 'Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Older'],
  selectedSkill: 'All Skills',
  selectedTimeRange: 'All Periods',
  loading: false,
  error: null,
};

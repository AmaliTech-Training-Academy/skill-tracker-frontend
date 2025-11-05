import { Task } from '@app/core/models/tasks-model';

export interface TasksState {
  todayTasks: Task[];
  previousTasks: Task[];
  selectedSkill: string;
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
  selectedSkill: 'All',
  selectedTimeRange: 'Yesterday',
  loading: false,
  error: null,
};

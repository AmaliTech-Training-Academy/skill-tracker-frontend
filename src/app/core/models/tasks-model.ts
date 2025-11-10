export enum TaskIcon {
  ABC = 'abc',
  PENCIL = 'pencil',
}

export enum TaskDifficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

export interface Task {
  id: string;
  title: string;
  icon: TaskIcon;
  description: string;
  skill: string;
  difficulty: TaskDifficulty;
  xp: number;
  time: string;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingTask {
  id: string;
  title: string;
  description: string;
  examples: TaskExample[];
  skill: string;
  difficulty: string;
  estimatedDuration: number;
  starterCode: string;
  language: string;
  xp: number;
}

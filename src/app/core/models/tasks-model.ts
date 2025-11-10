export interface Task {
  id: string;
  title: string;
  icon: 'abc' | 'pencil';
  description: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  time: string;
  status: 'Pending' | 'Completed';
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

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

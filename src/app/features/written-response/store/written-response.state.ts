export interface WrittenResponseTaskContent {
  contentType: string;
  prompt: string;
  detailedInstructions: string;
  evaluationCriteria: any; 
  rubric: any; 
  hints: string[];
  expectedLength: string;
}

export interface WrittenResponseTask {
  taskId: string;
  taskDefinitionId: string;
  title: string;
  description: string;
  skillName: string;
  type: string;
  difficulty: string;
  content: WrittenResponseTaskContent;
  version: number;
  isPublished: boolean;
  estimatedDurationInMinutes: number;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface WrittenResponseState {
  task: WrittenResponseTask | null;
  loading: boolean;
  error: string | null;
  userAnswer: string;
}

export const initialWrittenResponseState: WrittenResponseState = {
  task: null,
  loading: false,
  error: null,
  userAnswer: '',
};
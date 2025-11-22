export interface EvaluationCriteria {
  [key: string]: string;
}

export interface Rubric {
  [key: string]: string;
}
export interface WrittenResponseTaskContent {
  contentType: string;
  prompt: string;
  detailedInstructions: string;
  evaluationCriteria: EvaluationCriteria;
  rubric: Rubric;
  hints: string[];
  expectedLength: string;
}

export interface WrittenResponseSubmission {
  taskId: string;
  answer: {
    answerType: 'ESSAY';
    submissionText: string;
  };
}

export interface WrittenResponseSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    submissionId: string;
    status: string;
  };
  metadata: {
    traceId: string;
    timestamp: string;
  };
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

export interface WrittenResponseState {
  task: WrittenResponseTask | null;
  loading: boolean;
  error: string | null;
  userAnswer: string;
  submissionId: string | null;
  submissionStatus: string | null;
  isSubmitting: boolean;
}

export const initialWrittenResponseState: WrittenResponseState = {
  task: null,
  loading: false,
  error: null,
  userAnswer: '',
  submissionId: null,
  submissionStatus: null,
  isSubmitting: false,
};

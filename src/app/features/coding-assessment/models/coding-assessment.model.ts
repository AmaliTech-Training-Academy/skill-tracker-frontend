import { TaskTestCase } from '@app/core/models/tasks-model';

export interface CodeExecutionResult {
  output: string;
  type: 'success' | 'error';
  executionTime?: number;
}

export interface TestCaseResult {
  testCase: TaskTestCase;
  passed: boolean;
  actualOutput?: string;
  feedback?: string;
}

export interface CodeExecutionResponse {
  consoleOutput: CodeExecutionResult;
  testResults: TestCaseResult[];
}

export interface SubmissionStatusResponse {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  feedback?: {
    feedbackType: string;
    evaluation: {
      correctness: {
        score: number;
        percentage: number;
        feedback: string;
      };
      overall: {
        totalScore: number;
        percentage: number;
        xpEarned: number;
        passed: boolean;
        summary: string;
      };
    };
  };
  isCorrect: boolean;
  scoreEarned: number;
}

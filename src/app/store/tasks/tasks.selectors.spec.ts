import { selectCurrentTaskLanguageId, selectCurrentTask } from './tasks.selectors';
import { TaskType, TaskDifficulty, TaskContentType, Task } from '@app/core/models/tasks-model';

describe('Tasks Selectors', () => {
  describe('selectCurrentTaskLanguageId', () => {
    it('should return 71 (Python) when no task', () => {
      const result = selectCurrentTaskLanguageId.projector(null);
      expect(result).toBe(71);
    });

    it('should return 71 (Python) when task has no skillName', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Test',
        type: TaskType.CODING,
        difficulty: TaskDifficulty.BEGINNER,
        content: {
          contentType: TaskContentType.CODING as const,
          prompt: 'Test',
          starterCode: '',
          testCases: [],
          hints: [],
          examples: [],
          constraints: '',
          evaluationCriteria: { correctness: [], efficiency: [], style: [] },
        },
        xpReward: 100,
        estimatedDuration: 30,
        skillName: '',
        version: 1,
      };
      const result = selectCurrentTaskLanguageId.projector(task);
      expect(result).toBe(71);
    });

    it('should return 63 for JavaScript task', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Test',
        type: TaskType.CODING,
        difficulty: TaskDifficulty.BEGINNER,
        content: {
          contentType: TaskContentType.CODING as const,
          prompt: 'Test',
          starterCode: '',
          testCases: [],
          hints: [],
          examples: [],
          constraints: '',
          evaluationCriteria: { correctness: [], efficiency: [], style: [] },
        },
        xpReward: 100,
        estimatedDuration: 30,
        skillName: 'JavaScript',
        version: 1,
      };
      const result = selectCurrentTaskLanguageId.projector(task);
      expect(result).toBe(63);
    });

    it('should return 71 for Python task', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Test',
        type: TaskType.CODING,
        difficulty: TaskDifficulty.BEGINNER,
        content: {
          contentType: TaskContentType.CODING as const,
          prompt: 'Test',
          starterCode: '',
          testCases: [],
          hints: [],
          examples: [],
          constraints: '',
          evaluationCriteria: { correctness: [], efficiency: [], style: [] },
        },
        xpReward: 100,
        estimatedDuration: 30,
        skillName: 'Python',
        version: 1,
      };
      const result = selectCurrentTaskLanguageId.projector(task);
      expect(result).toBe(71);
    });

    it('should return 71 (Python) for unknown skill', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Test',
        type: TaskType.CODING,
        difficulty: TaskDifficulty.BEGINNER,
        content: {
          contentType: TaskContentType.CODING as const,
          prompt: 'Test',
          starterCode: '',
          testCases: [],
          hints: [],
          examples: [],
          constraints: '',
          evaluationCriteria: { correctness: [], efficiency: [], style: [] },
        },
        xpReward: 100,
        estimatedDuration: 30,
        skillName: 'UnknownLanguage',
        version: 1,
      };
      const result = selectCurrentTaskLanguageId.projector(task);
      expect(result).toBe(71);
    });

    it('should be case insensitive', () => {
      const task: Task = {
        id: '1',
        title: 'Test',
        description: 'Test',
        type: TaskType.CODING,
        difficulty: TaskDifficulty.BEGINNER,
        content: {
          contentType: TaskContentType.CODING as const,
          prompt: 'Test',
          starterCode: '',
          testCases: [],
          hints: [],
          examples: [],
          constraints: '',
          evaluationCriteria: { correctness: [], efficiency: [], style: [] },
        },
        xpReward: 100,
        estimatedDuration: 30,
        skillName: 'JAVASCRIPT',
        version: 1,
      };
      const result = selectCurrentTaskLanguageId.projector(task);
      expect(result).toBe(63);
    });
  });
});

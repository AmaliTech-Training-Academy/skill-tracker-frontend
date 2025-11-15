import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApiResponse } from '@app/core';
import {
  TaskUI,
  TaskIcon,
  TaskDifficulty,
  TaskStatus,
  TaskType,
  TaskContentType,
  GroupedTasksResponse,
  PagedResponse,
  TaskPaginationParams,
  CompletedPeriod,
} from '../../../core/models/tasks-model';

const MOCK_API_DELAY = 500;

const createMockPagedResponse = <T>(content: T[]): Omit<PagedResponse<T>, 'content'> => ({
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { empty: true, sorted: false, unsorted: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalElements: content.length,
  totalPages: 1,
  first: true,
  size: 10,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  numberOfElements: content.length,
  empty: content.length === 0,
});

@Injectable({
  providedIn: 'root',
})
export class TaskMockService {
  private mockTasks: TaskUI[] = [
    {
      id: 't1',
      title: 'Fix The Print Statement',
      description: 'Debug and fix the print statement syntax error.',
      type: TaskType.CODING,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.CODING,
        prompt: 'Fix the print statement in the given Python code.',
        hints: ['Check for missing quotes', 'Verify syntax'],
        examples: [{ input: 'print(Hello World)', output: 'print("Hello World")' }],
        constraints: 'Use Python 3 syntax',
        starterCode: 'print(Hello World)',
        testCases: [
          {
            input: '',
            expectedOutput: 'Hello World',
            isHidden: false,
            description: 'Should print Hello World',
          },
        ],
        evaluationCriteria: {
          correctness: ['Syntax is correct'],
          efficiency: [],
          style: ['Proper quotes'],
        },
      },
      xpReward: 50,
      estimatedDuration: 15,
      skillName: 'Python',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't2',
      title: 'Explain Data Structures',
      description: 'Write an essay explaining basic data structures.',
      type: TaskType.ESSAY,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.ESSAY,
        prompt: 'Explain what data structures are and why they are important.',
        hints: ['Think about organization', 'Consider efficiency'],
        wordLimit: 500,
        guidelines: ['Be clear and concise', 'Use examples'],
        rubric: ['Clarity', 'Accuracy', 'Examples'],
      },
      xpReward: 100,
      estimatedDuration: 20,
      skillName: 'Data Structures',
      version: 1,
      icon: TaskIcon.PENCIL,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't3',
      title: 'HTML Form Validation',
      description: 'Create a form with proper validation attributes.',
      type: TaskType.CODING,
      difficulty: TaskDifficulty.INTERMEDIATE,
      content: {
        contentType: TaskContentType.CODING,
        prompt: 'Build an HTML form with email and password validation.',
        hints: ['Use required attribute', 'Add input types'],
        examples: [{ input: '<input type="email">', output: 'Valid email input' }],
        constraints: 'Use HTML5 validation',
        starterCode: '<form>\n  <!-- Add your inputs here -->\n</form>',
        testCases: [
          {
            input: 'email field',
            expectedOutput: 'type="email" required',
            isHidden: false,
            description: 'Email field should have proper type and validation',
          },
        ],
        evaluationCriteria: {
          correctness: ['Proper validation'],
          efficiency: [],
          style: ['Semantic HTML'],
        },
      },
      xpReward: 80,
      estimatedDuration: 25,
      skillName: 'HTML',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
    {
      id: 't4',
      title: 'Array Methods Challenge',
      description: 'Implement array manipulation using JS methods.',
      type: TaskType.CODING,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.CODING,
        prompt: 'Use map, filter, and reduce to transform an array of numbers.',
        hints: ['Use arrow functions', 'Chain methods together'],
        examples: [{ input: '[1, 2, 3, 4, 5]', output: 'Filtered and mapped array' }],
        constraints: 'Use ES6+ array methods',
        starterCode: 'const numbers = [1, 2, 3, 4, 5];\n// Your code here',
        testCases: [
          {
            input: 'array methods',
            expectedOutput: 'map, filter, reduce used correctly',
            isHidden: false,
            description: 'Should use modern array methods',
          },
        ],
        evaluationCriteria: {
          correctness: ['Proper method usage'],
          efficiency: ['Functional approach'],
          style: ['ES6+ syntax'],
        },
      },
      xpReward: 70,
      estimatedDuration: 20,
      skillName: 'JavaScript',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
  ];

  private mockCompletedTasks: TaskUI[] = [
    {
      id: 'c1',
      title: 'CSS Selectors Quiz',
      description: 'Test your knowledge of CSS selectors.',
      type: TaskType.MULTIPLE_CHOICE,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.MULTIPLE_CHOICE,
        prompt: 'Which selector targets elements by class?',
        hints: ['Think about the dot notation'],
        options: [
          { id: '1', text: '.classname', isCorrect: true },
          { id: '2', text: '#classname', isCorrect: false },
          { id: '3', text: 'classname', isCorrect: false },
        ],
        explanation: 'The dot (.) is used to select elements by class name.',
      },
      xpReward: 75,
      estimatedDuration: 10,
      skillName: 'CSS',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'c2',
      title: 'JavaScript Variables',
      description: 'Complete the coding challenge on variable declarations.',
      type: TaskType.CODING,
      difficulty: TaskDifficulty.BEGINNER,
      content: {
        contentType: TaskContentType.CODING,
        prompt: 'Declare variables using let, const, and var appropriately.',
        hints: ['Consider scope', 'Think about mutability'],
        examples: [{ input: 'let name = "John"', output: 'Correct variable declaration' }],
        constraints: 'Use ES6+ syntax',
        starterCode: '// Declare your variables here',
        testCases: [
          {
            input: 'variable declaration',
            expectedOutput: 'let, const, var used correctly',
            isHidden: false,
            description: 'Variables should be declared with appropriate keywords',
          },
        ],
        evaluationCriteria: {
          correctness: ['Proper declarations'],
          efficiency: [],
          style: ['ES6+ syntax'],
        },
      },
      xpReward: 90,
      estimatedDuration: 18,
      skillName: 'JavaScript',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.COMPLETED,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ];

  public getAllTasks(
    params: TaskPaginationParams = {},
  ): Observable<ApiResponse<GroupedTasksResponse>> {
    let filteredPendingTasks = this.mockTasks;
    let filteredCompletedTasks = this.mockCompletedTasks;

    if (params.skillName) {
      filteredPendingTasks = filteredPendingTasks.filter((task) =>
        task.skillName.toLowerCase().includes(params.skillName!.toLowerCase()),
      );
      filteredCompletedTasks = filteredCompletedTasks.filter((task) =>
        task.skillName.toLowerCase().includes(params.skillName!.toLowerCase()),
      );
    }

    if (params.completedPeriod && params.completedPeriod !== CompletedPeriod.ALL_PERIODS) {
      filteredCompletedTasks = this.filterTasksByPeriod(
        filteredCompletedTasks,
        params.completedPeriod,
      );
    }

    const pendingPage: PagedResponse<TaskUI> = {
      content: filteredPendingTasks,
      ...createMockPagedResponse(filteredPendingTasks),
    };

    const completedPage: PagedResponse<TaskUI> = {
      content: filteredCompletedTasks,
      ...createMockPagedResponse(filteredCompletedTasks),
    };

    const response: ApiResponse<GroupedTasksResponse> = {
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        pending: pendingPage,
        completed: completedPage,
      },
      metadata: {
        traceId: 'mock-trace-id',
        timestamp: new Date().toISOString(),
      },
    };

    return of(response).pipe(delay(MOCK_API_DELAY));
  }

  private filterTasksByPeriod(tasks: TaskUI[], period: CompletedPeriod): TaskUI[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);

      switch (period) {
        case CompletedPeriod.TODAY:
          return taskDate >= today;
        case CompletedPeriod.YESTERDAY:
          return taskDate >= yesterday && taskDate < today;
        case CompletedPeriod.LAST_7_DAYS:
          return taskDate >= last7Days;
        case CompletedPeriod.LAST_30_DAYS:
          return taskDate >= last30Days;
        case CompletedPeriod.OLDER:
          return taskDate < last30Days;
        case CompletedPeriod.ALL_PERIODS:
          return true;
        default:
          return true;
      }
    });
  }
}

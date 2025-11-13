export enum TaskIcon {
  ABC = 'abc',
  PENCIL = 'pencil',
}

export enum TaskType {
  CODING = 'CODING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
}

export enum TaskDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TaskContentType {
  CODING = 'CODING',
  ESSAY = 'ESSAY',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface BaseTaskContent {
  contentType: TaskContentType;
  prompt: string;
  hints?: string[];
}

export interface TaskTestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description: string;
}

export interface TaskEvaluationCriteria {
  correctness: string[];
  efficiency: string[];
  style: string[];
}

export interface CodingTaskContent extends BaseTaskContent {
  contentType: TaskContentType.CODING;
  examples: TaskExample[];
  constraints: string;
  starterCode: string;
  testCases: TaskTestCase[];
  evaluationCriteria: TaskEvaluationCriteria;
}

export interface EssayTaskContent extends BaseTaskContent {
  contentType: TaskContentType.ESSAY;
  wordLimit?: number;
  guidelines: string[];
  rubric: string[];
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceTaskContent extends BaseTaskContent {
  contentType: TaskContentType.MULTIPLE_CHOICE;
  options: MultipleChoiceOption[];
  explanation: string;
}

export type TaskContent = CodingTaskContent | EssayTaskContent | MultipleChoiceTaskContent;

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  content: TaskContent;
  xpReward: number;
  estimatedDuration: number;
  skillName: string;
  version: number;
}

export interface CodingTaskDetail extends Omit<Task, 'content'> {
  type: TaskType.CODING;
  content: CodingTaskContent;
}

export interface EssayTaskDetail extends Omit<Task, 'content'> {
  type: TaskType.ESSAY;
  content: EssayTaskContent;
}

export interface MultipleChoiceTaskDetail extends Omit<Task, 'content'> {
  type: TaskType.MULTIPLE_CHOICE;
  content: MultipleChoiceTaskContent;
}

export interface TaskUI extends Task {
  icon: TaskIcon;
  status: TaskStatus;
  createdAt: string;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}

export interface GroupedTasksResponse {
  pending: PagedResponse<Task>;
  completed: PagedResponse<Task>;
}

export interface ApiMetadata {
  traceId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  metadata: ApiMetadata;
}

export interface TaskPaginationParams {
  pendingPage?: number;
  pendingSize?: number;
  completedPage?: number;
  completedSize?: number;
}

export interface SuggestedTasksParams {
  skillName: string;
  taskType: TaskType;
  limit?: number;
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

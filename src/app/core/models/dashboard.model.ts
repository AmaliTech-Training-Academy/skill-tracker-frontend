import { ApiResponse, SkillLevel } from './auth.model';
import { TaskIcon, TaskStatus, TaskUI } from './tasks-model';

export interface UserStats {
  totalTasksCompleted: number;
  currentStreakInDays: number;
  longestStreakInDays: number;
  lastPracticeDate: string;
}

export interface SkillProgress {
  skillId: string;
  skillName: string;
  averageScore: number;
  proficiency: number;
  tasksCompleted: number;
  currentXp: number;
  currentLevel: SkillLevel;
  nextLevel: SkillLevel;
  xpToNextLevel: number;
  currentLevelTotalXp: number;
}

export interface GoalStatus {
  goalId: string;
  description: string;
  type: string;
  currentValue: number;
  targetValue: number;
  initialValue: number;
  progressPercentage: number;
  deadline: string;
  status: string;
}

export interface SkillGap {
  rubric: string;
  averageScore: number;
  description: string;
}

export interface Recommendation {
  recommendationText: string;
  relatedRubric: string;
}

export interface DashboardData {
  userStats: UserStats;
  skillProgress: SkillProgress[];
  goalStatus: GoalStatus[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
  globalRank: number | null;
}

export enum RecommendedTaskType {
  CODING = 'CODING',
  ESSAY = 'ESSAY',
}

export interface RecommendedTask {
  id: string;
  title: string;
  type: RecommendedTaskType;
  difficulty: SkillLevel;
  skillName: string;
  xpReward: number;
  estimatedDuration: number;
}

export interface RecommendedTaskUI extends RecommendedTask {
  icon: TaskIcon;
  description: string;
  status: TaskStatus;
  time: string;
  skill: string;
  xp: number;
}

export interface UserSelectedSkill {
  skillId: string;
  skillName: string;
  difficultyLevel: SkillLevel;
  selectedAt: string;
}

export enum TrajectoryGranularity {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export interface SkillTrajectoryData {
  snapshotDate: string;
  averageXpEarned: number;
  tasksCompletedUpToDate: number;
}

export type DashboardResponse = ApiResponse<DashboardData>;
export type RecommendedTasksResponse = ApiResponse<TaskUI[]>;
export type SkillTrajectoryResponse = ApiResponse<SkillTrajectoryData[]>;
export type UserSelectedSkillsResponse = ApiResponse<UserSelectedSkill[]>;

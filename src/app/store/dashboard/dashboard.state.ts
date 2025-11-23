import { AppError, DashboardData, TaskUI, SkillTrajectoryData, UserSelectedSkill } from '@app/core';

export interface DashboardState {
  data: DashboardData | null;
  isDashboardAnalyticsLoading: boolean;
  isDashboardAnalyticsError: AppError | null;

  recommendedTasks: TaskUI[];
  isRecommendedTasksLoading: boolean;
  isRecommendedTasksError: AppError | null;

  trajectoryData: SkillTrajectoryData[];
  isTrajectoryLoading: boolean;
  isTrajectoryError: AppError | null;

  userSkills: UserSelectedSkill[];
  isUserSkillsLoading: boolean;
  isUserSkillsError: AppError | null;
  selectedSkillId: string | null;
  selectedSkillName: string | null;
}

export const initialDashboardState: DashboardState = {
  data: null,
  isDashboardAnalyticsLoading: false,
  isDashboardAnalyticsError: null,

  recommendedTasks: [],
  isRecommendedTasksLoading: false,
  isRecommendedTasksError: null,

  trajectoryData: [],
  isTrajectoryLoading: false,
  isTrajectoryError: null,

  userSkills: [],
  isUserSkillsLoading: false,
  isUserSkillsError: null,
  selectedSkillId: null,
  selectedSkillName: null,
};

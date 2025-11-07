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
  currentLevel: string;
  nextLevel: string;
  xpToNextLevel: number;
  currentLevelTotalXp: number;
}

export interface DashboardData {
  userStats: UserStats;
  skillProgress: SkillProgress[];
  recommendedTasks: RecommendedTask[];
  progressChartData: ProgressChartData;
}

export interface RecommendedTask {
  id: string;
  type: 'Skill Assessment' | 'Concept Explanation';
  title: string;
  tags: string[];
  xp: number;
  durationInMin?: number;
}

export interface ProgressChartData {
  weekly: { label: string; value: number }[];
}

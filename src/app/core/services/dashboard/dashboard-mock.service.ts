import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardData } from '../../models/dashboard.model';

export const EMPTY_STATE_DATA: DashboardData = {
  userStats: {
    totalTasksCompleted: 2,
    currentStreakInDays: 2,
    longestStreakInDays: 2,
    lastPracticeDate: new Date().toISOString(),
  },
  skillProgress: [
    {
      skillId: 'temp-id-1',
      skillName: 'HTML',
      averageScore: 0,
      proficiency: 0,
      tasksCompleted: 2,
      currentXp: 30,
      currentLevel: 'Level 1',
      nextLevel: 'Level 2',
      xpToNextLevel: 4970,
      currentLevelTotalXp: 5000,
    },
  ],
  recommendedTasks: [
    {
      id: 'task-1',
      type: 'Skill Assessment',
      title: 'Data Structures',
      tags: ['Beginner'],
      xp: 50,
      durationInMin: 15,
    },
    {
      id: 'task-2',
      type: 'Concept Explanation',
      title: 'Explain a key concept in your own words',
      tags: ['Data Structures', 'Beginner'],
      xp: 50,
    },
  ],
  progressChartData: {
    weekly: [
      { label: 'Mon', value: 30 },
      { label: 'Tue', value: 0 },
      { label: 'Wed', value: 0 },
      { label: 'Thu', value: 0 },
      { label: 'Fri', value: 0 },
      { label: 'Sat', value: 0 },
      { label: 'Sun', value: 0 },
    ],
  },
};

export const POPULATED_STATE_DATA: DashboardData = {
  userStats: {
    totalTasksCompleted: 87,
    currentStreakInDays: 7,
    longestStreakInDays: 0,
    lastPracticeDate: '22nd August, 2025',
  },
  skillProgress: [
    {
      skillId: 'sk-py-001',
      skillName: 'Python',
      averageScore: 0.85,
      proficiency: 0.72,
      tasksCompleted: 45,
      currentXp: 2100,
      currentLevel: 'INTERMEDIATE',
      nextLevel: 'ADVANCED',
      xpToNextLevel: 2400,
      currentLevelTotalXp: 3000,
    },
    {
      skillId: 'sk-sd-002',
      skillName: 'System Design',
      averageScore: 0.6,
      proficiency: 0.3,
      tasksCompleted: 10,
      currentXp: 800,
      currentLevel: 'BEGINNER',
      nextLevel: 'INTERMEDIATE',
      xpToNextLevel: 1200,
      currentLevelTotalXp: 2000,
    },
    {
      skillId: 'sk-html-003',
      skillName: 'HTML',
      averageScore: 0.1,
      proficiency: 0.05,
      tasksCompleted: 2,
      currentXp: 30,
      currentLevel: 'Level 1',
      nextLevel: 'Level 2',
      xpToNextLevel: 4970,
      currentLevelTotalXp: 5000,
    },
    {
      skillId: 'sk-scss-004',
      skillName: 'SCSS',
      averageScore: 0,
      proficiency: 0,
      tasksCompleted: 0,
      currentXp: 0,
      currentLevel: 'BEGINNER',
      nextLevel: 'INTERMEDIATE',
      xpToNextLevel: 2000,
      currentLevelTotalXp: 2000,
    },
  ],
  recommendedTasks: [],
  progressChartData: {
    weekly: [
      { label: 'Mon', value: 30 },
      { label: 'Tue', value: 0 },
      { label: 'Wed', value: 0 },
      { label: 'Thu', value: 0 },
      { label: 'Fri', value: 0 },
      { label: 'Sat', value: 0 },
      { label: 'Sun', value: 0 },
    ],
  },
};

@Injectable({
  providedIn: 'root',
})
export class DashboardMockService {
  public getEmptyDashboardData(): Observable<DashboardData> {
    return of(EMPTY_STATE_DATA);
  }

  public getPopulatedDashboardData(): Observable<DashboardData> {
    return of(POPULATED_STATE_DATA);
  }
}

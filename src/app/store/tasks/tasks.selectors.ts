import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { TaskUI, CompletedPeriod } from '@app/core/models/tasks-model';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectTodayTasks = createSelector(
  selectTasksState,
  ({ pendingTasks }) => pendingTasks,
);

export const selectAllPreviousTasks = createSelector(
  selectTasksState,
  ({ completedTasks }) => completedTasks,
);

export const selectSkills = createSelector(selectTasksState, ({ skills }) => skills);

export const selectSkillFilter = createSelector(
  selectTasksState,
  ({ selectedSkill }) => selectedSkill || 'All Skills',
);

export const selectTimeRanges = createSelector(selectTasksState, ({ timeRanges }) => timeRanges);

export const selectTimeRangeFilter = createSelector(
  selectTasksState,
  ({ selectedTimeRange }) => selectedTimeRange,
);

export const selectFilteredTodayTasks = createSelector(
  selectTodayTasks,
  selectSkillFilter,
  (tasks: TaskUI[], skill: string) => {
    if (skill === 'All Skills' || !skill) {
      return tasks;
    }
    return tasks.filter((task) => task.skillName === skill);
  },
);

export const selectFilteredPreviousTasks = createSelector(
  selectAllPreviousTasks,
  selectSkillFilter,
  selectTimeRangeFilter,
  (tasks: TaskUI[], skill: string, timeRange: CompletedPeriod) => {
    let filteredTasks = tasks;

    if (skill !== 'All Skills' && skill) {
      filteredTasks = filteredTasks.filter((task) => task.skillName === skill);
    }

    if (timeRange && timeRange !== CompletedPeriod.ALL_PERIODS) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.createdAt);

        switch (timeRange) {
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
          default:
            return true;
        }
      });
    }

    return filteredTasks;
  },
);

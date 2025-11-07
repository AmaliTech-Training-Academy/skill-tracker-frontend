import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { Task } from '@app/core/models/tasks-model';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectTodayTasks = createSelector(selectTasksState, ({ todayTasks }) => todayTasks);

export const selectAllPreviousTasks = createSelector(
  selectTasksState,
  ({ previousTasks }) => previousTasks,
);

export const selectSkills = createSelector(selectTasksState, ({ skills }) => skills);

export const selectSkillFilter = createSelector(
  selectTasksState,
  ({ selectedSkill }) => selectedSkill,
);

export const selectTimeRanges = createSelector(selectTasksState, ({ timeRanges }) => timeRanges);

export const selectTimeRangeFilter = createSelector(
  selectTasksState,
  ({ selectedTimeRange }) => selectedTimeRange,
);

export const selectFilteredTodayTasks = createSelector(
  selectTodayTasks,
  selectSkillFilter,
  (tasks: Task[], skill: string) => {
    if (skill === 'All Skills') {
      return tasks;
    }
    return tasks.filter((task) => task.skill === skill);
  },
);

export const selectFilteredPreviousTasks = createSelector(
  selectAllPreviousTasks,
  selectSkillFilter,
  selectTimeRangeFilter,
  (tasks: Task[], skill: string, timeRange: string) => {
    let filteredTasks = tasks;

    if (skill !== 'All Skills') {
      filteredTasks = filteredTasks.filter((task) => task.skill === skill);
    }

    if (timeRange && timeRange !== 'All Periods') {
      const now = new Date();
      const filterDate = new Date();

      switch (timeRange) {
        case 'Today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'Yesterday':
          filterDate.setDate(now.getDate() - 1);
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'Last 7 days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'Last 30 days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'Older':
          filterDate.setDate(now.getDate() - 90);
          filteredTasks = filteredTasks.filter((task) => new Date(task.createdAt) < filterDate);
          return filteredTasks;
        default:
          return filteredTasks;
      }

      filteredTasks = filteredTasks.filter((task) => new Date(task.createdAt) >= filterDate);
    }

    return filteredTasks;
  },
);

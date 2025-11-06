import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { Task } from '@app/core/models/tasks-model';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectTodayTasks = createSelector(selectTasksState, (state) => state.todayTasks);

export const selectAllPreviousTasks = createSelector(
  selectTasksState,
  (state) => state.previousTasks,
);

export const selectSkills = createSelector(selectTasksState, (state) => state.skills);

export const selectSkillFilter = createSelector(selectTasksState, (state) => state.selectedSkill);

export const selectTimeRangeFilter = createSelector(
  selectTasksState,
  (state) => state.selectedTimeRange,
);

export const selectFilteredTodayTasks = createSelector(
  selectTodayTasks,
  selectSkillFilter,
  (tasks: Task[], skill: string) => {
    if (skill === 'All') {
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
    if (skill === 'All') {
      return tasks;
    }
    return tasks.filter((task) => task.skill === skill);
  },
);

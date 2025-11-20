import { createAction, props } from '@ngrx/store';
import {
  GroupedTasksResponse,
  CompletedPeriod,
  Task,
  CodeExecutionResponse,
} from '@app/core/models/tasks-model';

export const loadTasks = createAction('[Tasks Dashboard] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks API] Load Tasks Success',
  props<{ data: GroupedTasksResponse }>(),
);

export const loadTasksFailure = createAction(
  '[Tasks API] Load Tasks Failure',
  props<{ error: string }>(),
);

export const changeSkillFilter = createAction(
  '[Tasks Header] Change Skill Filter',
  props<{ skill: string }>(),
);

export const changeTimeRangeFilter = createAction(
  '[Tasks List] Change Time Range Period Filter',
  props<{ period: CompletedPeriod }>(),
);

export const startTask = createAction('[Task Card] Start Task', props<{ taskId: string }>());

export const loadCurrentTask = createAction(
  '[Coding Assessment] Load Current Task',
  props<{ taskId: string }>(),
);

export const loadCurrentTaskSuccess = createAction(
  '[Tasks API] Load Current Task Success',
  props<{ task: Task }>(),
);

export const loadCurrentTaskFailure = createAction(
  '[Tasks API] Load Current Task Failure',
  props<{ error: string }>(),
);

export const clearCurrentTask = createAction('[Coding Assessment] Clear Current Task');

export const startTimer = createAction(
  '[Coding Assessment] Start Timer',
  props<{ durationMinutes: number; taskId: string }>(),
);

export const updateTimer = createAction(
  '[Timer] Update Timer',
  props<{ remainingSeconds: number }>(),
);

export const stopTimer = createAction('[Timer] Stop Timer');

export const timerExpired = createAction('[Timer] Timer Expired');

export const restoreTimer = createAction('[App] Restore Timer');

export const restoreTimerSuccess = createAction(
  '[Timer] Restore Timer Success',
  props<{
    timer: { isRunning: boolean; remainingSeconds: number; endTime: number; taskId: string };
  }>(),
);

export const executeCode = createAction(
  '[Coding Assessment] Execute Code',
  props<{ taskId: string; code: string; languageId: number }>(),
);

export const executeCodeSuccess = createAction(
  '[Tasks API] Execute Code Success',
  props<{ result: CodeExecutionResponse }>(),
);

export const executeCodeFailure = createAction(
  '[Tasks API] Execute Code Failure',
  props<{ error: string }>(),
);

export const submitTaskSolution = createAction(
  '[Coding Assessment] Submit Task Solution',
  props<{ taskId: string; code: string; languageId: number }>(),
);

export const submitTaskSolutionSuccess = createAction(
  '[Tasks API] Submit Task Solution Success',
  props<{ submissionId: string }>(),
);

export const submitTaskSolutionFailure = createAction(
  '[Tasks API] Submit Task Solution Failure',
  props<{ error: string }>(),
);

export const loadLanguages = createAction('[Coding Assessment] Load Languages');

export const loadLanguagesSuccess = createAction(
  '[Tasks API] Load Languages Success',
  props<{ languages: import('@app/core/models/tasks-model').ProgrammingLanguage[] }>(),
);

export const loadLanguagesFailure = createAction(
  '[Tasks API] Load Languages Failure',
  props<{ error: string }>(),
);

export const updateUserCode = createAction(
  '[Coding Assessment] Update User Code',
  props<{ code: string; taskId: string }>(),
);

export const restoreUserCode = createAction(
  '[Coding Assessment] Restore User Code',
  props<{ taskId: string }>(),
);

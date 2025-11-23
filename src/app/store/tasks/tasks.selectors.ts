import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.state';
import { TaskUI } from '@app/core/models/tasks-model';
import { PROGRAMMING_LANGUAGES } from '@app/core/constants/programming-languages';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectCurrentTask = createSelector(
  selectTasksState,
  (state) => state?.currentTask || null,
);

export const selectCurrentTaskLoading = createSelector(
  selectTasksState,
  ({ currentTaskLoading }) => currentTaskLoading,
);

export const selectTimer = createSelector(selectTasksState, ({ timer }) => timer);

export const selectTimerDisplay = createSelector(selectTimer, ({ remainingSeconds }) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

export const selectIsTimerRunning = createSelector(selectTimer, ({ isRunning }) => isRunning);

export const selectCodeExecuting = createSelector(
  selectTasksState,
  ({ codeExecuting }) => codeExecuting,
);

export const selectSubmitting = createSelector(selectTasksState, ({ submitting }) => submitting);

export const selectExecutionResult = createSelector(
  selectTasksState,
  ({ executionResult }) => executionResult,
);

export const selectConsoleOutput = createSelector(selectExecutionResult, (result) =>
  result
    ? {
        output: result.stdout || result.stderr || '',
        type: result.allTestsPassed ? ('success' as const) : ('error' as const),
        executionTime: result.avgExecutionTimeMs,
      }
    : null,
);

export const selectTestResults = createSelector(
  selectExecutionResult,
  (result) =>
    result?.testResults?.map((test) => ({
      testCase: {
        input: test.input,
        expectedOutput: test.expectedOutput,
        isHidden: false,
        description: test.statusDescription,
      },
      passed: test.passed,
      actualOutput: test.actualOutput,
      feedback: test.statusDescription,
    })) || [],
);

export const selectUserCode = createSelector(selectTasksState, ({ userCode }) => userCode);

export const selectCurrentTaskLanguageId = createSelector(selectCurrentTask, (task) => {
  if (!task?.skillName) return 113;

  const skillName = task.skillName.toLowerCase();
  const language = PROGRAMMING_LANGUAGES.find((lang) =>
    lang.name.toLowerCase().includes(skillName),
  );

  return language?.id || 113;
});

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
  (tasks: TaskUI[], skill: string) => {
    if (skill === 'All Skills' || !skill) {
      return tasks;
    }
    return tasks.filter((task) => task.skillName === skill);
  },
);

export const selectSubmissionResult = createSelector(
  selectTasksState,
  ({ submissionResult }) => submissionResult,
);

export const selectXpEarned = createSelector(
  selectSubmissionResult,
  (result) => result?.xpEarned || 0,
);

export const selectSubmissionId = createSelector(
  selectSubmissionResult,
  (result) => result?.submissionId || null,
);

export const selectSubmissionState = createSelector(
  selectTasksState,
  (state) => state.submissionState,
);

export const selectSubmissionStatus = createSelector(
  selectSubmissionState,
  (state) => state.status,
);

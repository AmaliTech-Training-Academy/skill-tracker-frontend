import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
  OnDestroy,
  computed,
  effect,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChallengeDescription } from './components/challenge-description/challenge-description';
import { CodingEditor } from './components/coding-editor/coding-editor';
import { OutputConsole } from './components/output-console/output-console';
import { TaskComplete } from '@app/shared/components/task-complete/task-complete';
import { TaskFailure } from '@app/shared/components/task-failure/task-failure';
import {
  selectCurrentTask,
  selectIsTimerRunning,
  selectCurrentTaskLoading,
  selectConsoleOutput,
  selectTestResults,
  selectCodeExecuting,
  selectSubmitting,
  selectUserCode,
  selectCurrentTaskLanguageId,
  selectSubmissionResult,
  selectXpEarned,
} from '@app/store/tasks/tasks.selectors';
import * as TasksActions from '@app/store/tasks/tasks.actions';
import * as AuthActions from '@app/store/auth/auth.actions';
import { TaskType, CodingTaskContent } from '@app/core/models/tasks-model';
import { ToastService } from '@app/core/services/toast/toast-service';

const DEFAULT_DURATION_MINUTES = 30;
const DESKTOP_BREAKPOINT = 1024;
const TABLET_BREAKPOINT = 768;

type ViewState = 'loading' | 'no-task' | 'description' | 'coding';

@Component({
  selector: 'app-coding-assessment',
  imports: [ChallengeDescription, CodingEditor, OutputConsole, TaskComplete, TaskFailure],
  templateUrl: './coding-assessment.html',
  styleUrl: './coding-assessment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingAssessment implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
  ) {}

  public currentTask = this.store.selectSignal(selectCurrentTask);
  public loading = this.store.selectSignal(selectCurrentTaskLoading);
  public isTimerRunning = this.store.selectSignal(selectIsTimerRunning);

  public assessmentStarted = signal(false);
  public userCode = this.store.selectSignal(selectUserCode);
  public currentLanguageId = this.store.selectSignal(selectCurrentTaskLanguageId);
  private userHasEditedCode = signal(false);
  public executionResult = this.store.selectSignal(selectConsoleOutput);
  public testResults = this.store.selectSignal(selectTestResults);
  public codeExecuting = this.store.selectSignal(selectCodeExecuting);
  public submitting = this.store.selectSignal(selectSubmitting);
  public submissionResult = this.store.selectSignal(selectSubmissionResult);
  public xpEarned = this.store.selectSignal(selectXpEarned);
  public isDesktop = signal(window.innerWidth >= DESKTOP_BREAKPOINT);
  public isTablet = signal(window.innerWidth <= TABLET_BREAKPOINT);

  private readonly taskId = this.route.snapshot.paramMap.get('taskId');

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.isDesktop.set(window.innerWidth >= DESKTOP_BREAKPOINT);
  }

  private readonly syncStarterCode = effect(() => {
    const task = this.currentTask();
    if (task?.type === TaskType.CODING && this.taskId) {
      this.store.dispatch(TasksActions.restoreUserCode({ taskId: this.taskId }));
      const userCode = this.userCode();
      if (userCode === '' && !this.userHasEditedCode()) {
        const codingContent = task.content as CodingTaskContent;
        if (codingContent.starterCode) {
          this.store.dispatch(
            TasksActions.updateUserCode({
              code: codingContent.starterCode,
              taskId: this.taskId,
            }),
          );
        }
      }
    }
  });

  public readonly viewState = computed((): ViewState => {
    if (this.loading()) return 'loading';
    if (!this.currentTask()) return 'no-task';

    const hasStarted = this.assessmentStarted() || this.isTimerRunning();

    if (this.isDesktop()) {
      return 'description';
    }

    return hasStarted ? 'coding' : 'description';
  });

  ngOnInit() {
    if (this.taskId) {
      this.store.dispatch(TasksActions.loadCurrentTask({ taskId: this.taskId }));
      this.store.dispatch(TasksActions.restoreTimer({ taskId: this.taskId }));
    }

    if (this.isTablet()) {
      this.toastService.showInfo(
        'Info Message',
        "You'll have a better experience coding using your laptop.",
      );
    }
  }

  ngOnDestroy() {
    this.store.dispatch(TasksActions.stopTimer());
    this.store.dispatch(TasksActions.clearCurrentTask());
  }

  public onStartTask(): void {
    this.assessmentStarted.set(true);
    const task = this.currentTask();
    if (task && this.taskId) {
      const durationMinutes = task.estimatedDuration || DEFAULT_DURATION_MINUTES;
      this.store.dispatch(TasksActions.startTimer({ durationMinutes, taskId: this.taskId }));
    }
  }

  public onCodeChanged(newCode: string): void {
    if (this.taskId) {
      this.userHasEditedCode.set(true);
      this.store.dispatch(TasksActions.updateUserCode({ code: newCode, taskId: this.taskId }));
    }
  }

  public onRunCode(): void {
    const task = this.currentTask();
    const code = this.userCode();
    const languageId = this.currentLanguageId();

    if (!task || !code) {
      return;
    }

    this.store.dispatch(TasksActions.executeCode({ taskId: task.id, code, languageId }));
  }

  public onSubmitTask(): void {
    const task = this.currentTask();
    const code = this.userCode();
    const languageId = this.currentLanguageId();

    if (!task || !code) {
      return;
    }

    this.store.dispatch(TasksActions.submitTaskSolution({ taskId: task.id, code, languageId }));
  }

  public onTaskComplete(): void {
    const xpEarned = this.xpEarned();
    if (xpEarned > 0) {
      this.store.dispatch(AuthActions.updateUserXp({ xpToAdd: xpEarned }));
    }
    this.store.dispatch(TasksActions.clearSubmissionResult());
    this.router.navigate(['/dashboard/tasks']);
  }

  public onTryAgain(): void {
    this.store.dispatch(TasksActions.clearSubmissionResult());
  }

  public onBackToDashboard(): void {
    this.store.dispatch(TasksActions.clearSubmissionResult());
    this.router.navigate(['/dashboard/tasks']);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
  OnDestroy,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChallengeDescription } from './components/challenge-description/challenge-description';
import { CodingEditor } from './components/coding-editor/coding-editor';
import {
  selectCurrentTask,
  selectCurrentTaskLoading,
  selectIsTimerRunning,
} from '@app/store/tasks/tasks.selectors';
import * as TasksActions from '@app/store/tasks/tasks.actions';

const DEFAULT_DURATION_MINUTES = 30;
const DESKTOP_BREAKPOINT = 1024;

type ViewState = 'loading' | 'no-task' | 'description' | 'coding';

@Component({
  selector: 'app-coding-assessment',
  imports: [ChallengeDescription, CodingEditor],
  templateUrl: './coding-assessment.html',
  styleUrl: './coding-assessment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingAssessment implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  public currentTask = this.store.selectSignal(selectCurrentTask);
  public loading = this.store.selectSignal(selectCurrentTaskLoading);
  public isTimerRunning = this.store.selectSignal(selectIsTimerRunning);

  public assessmentStarted = signal(false);
  public userCode = signal('');
  public isDesktop = signal(window.innerWidth >= DESKTOP_BREAKPOINT);

  private taskId = this.route.snapshot.paramMap.get('taskId');

  private resizeHandler = () => {
    this.isDesktop.set(window.innerWidth >= DESKTOP_BREAKPOINT);
  };

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
      this.store.dispatch(TasksActions.restoreTimer());
    }

    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy() {
    this.store.dispatch(TasksActions.clearCurrentTask());
    window.removeEventListener('resize', this.resizeHandler);
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
    this.userCode.set(newCode);
  }
}

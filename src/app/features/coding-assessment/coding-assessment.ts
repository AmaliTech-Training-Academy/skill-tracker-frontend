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
import { selectCurrentTask, selectCurrentTaskLoading } from '@app/store/tasks/tasks.selectors';
import * as TasksActions from '@app/store/tasks/tasks.actions';

const DEFAULT_DURATION_MINUTES = 30;

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

  public assessmentStarted = signal(false);
  public userCode = signal('');

  public readonly viewState = computed(() => {
    if (this.loading()) return 'loading';
    if (!this.currentTask()) return 'no-task';
    if (!this.assessmentStarted()) return 'description';
    return 'coding';
  });

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.store.dispatch(TasksActions.loadCurrentTask({ taskId }));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(TasksActions.clearCurrentTask());
  }

  public onStartTask(): void {
    this.assessmentStarted.set(true);
    const task = this.currentTask();
    if (task) {
      const durationMinutes = task.estimatedDuration || DEFAULT_DURATION_MINUTES;
      this.store.dispatch(TasksActions.startTimer({ durationMinutes }));
    }
  }

  public onCodeChanged(newCode: string): void {
    this.userCode.set(newCode);
  }
}

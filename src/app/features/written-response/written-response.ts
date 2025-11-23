import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, filter, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@app/core';
import { Router } from '@angular/router';
import {
  selectWrittenResponseError,
  selectWrittenResponseLoading,
  selectWrittenResponsePrompt,
  selectWrittenResponseUserAnswer,
  selectWrittenResponseTitle,
  selectWrittenResponseDifficulty,
  selectWrittenResponseXpReward,
  selectWrittenResponseHints,
  selectWrittenResponseExpectedDuration,
  selectWrittenResponseIsSubmitting,
  selectWrittenResponseTaskId,
  selectWrittenResponseQuizCompleted,
  selectWrittenResponseTask,
} from './store/written-response.selectors';
import * as WrittenResponseActions from './store/written-response.action';
import { TextArea } from './components/text-area/text-area';

@Component({
  selector: 'app-written-response',
  standalone: true,
  imports: [CommonModule, TextArea, FormsModule],
  templateUrl: './written-response.html',
  styleUrls: ['./written-response.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrittenResponse implements OnInit, OnDestroy {
  public taskTitle = this.store.selectSignal(selectWrittenResponseTitle);
  public taskDifficulty = this.store.selectSignal(selectWrittenResponseDifficulty);
  public xpReward = this.store.selectSignal(selectWrittenResponseXpReward);
  public prompt = this.store.selectSignal(selectWrittenResponsePrompt);
  public hints = this.store.selectSignal(selectWrittenResponseHints);
  public userAnswer = this.store.selectSignal(selectWrittenResponseUserAnswer);
  public loading = this.store.selectSignal(selectWrittenResponseLoading);
  public error = this.store.selectSignal(selectWrittenResponseError);
  public expectedDuration = this.store.selectSignal(selectWrittenResponseExpectedDuration);
  public isSubmitting = this.store.selectSignal(selectWrittenResponseIsSubmitting);
  public taskId = this.store.selectSignal(selectWrittenResponseTaskId);
  public quizCompleted = this.store.selectSignal(selectWrittenResponseQuizCompleted);

  public progressValue: number = 0;
  public timerLabel: string = '00:00';
  private intervalId?: ReturnType<typeof setInterval>;
  private taskSubscription?: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routeTaskId = this.route.snapshot.paramMap.get('id');

    if (routeTaskId) {
      this.store.dispatch(WrittenResponseActions.loadWrittenResponseTask({ taskId: routeTaskId }));

      this.taskSubscription = this.store
        .select(selectWrittenResponseTask)
        .pipe(
          filter((task) => task !== null),
          take(1),
        )
        .subscribe((task) => {
          if (task) {
            const duration = task.estimatedDurationInMinutes || 10;
            const totalSeconds = duration * 60;
            this.startTimer(totalSeconds);
          }
        });
    } else {
      this.toast.showError('Task Error', 'The task is not available, try a different task');
      this.store.dispatch(
        WrittenResponseActions.loadWrittenResponseTaskFailure({ error: 'Task ID not provided.' }),
      );
      this.router.navigateByUrl('/dashboard/tasks');
    }

    this.progressValue = 0;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    this.store.dispatch(WrittenResponseActions.clearWrittenResponseState());
  }

  private startTimer(initialTimeInSeconds: number): void {
    let timeRemaining = initialTimeInSeconds;
    this.updateTimerLabel(timeRemaining);

    this.intervalId = setInterval(() => {
      if (timeRemaining > 0 && !this.quizCompleted()) {
        timeRemaining--;
        this.updateTimerLabel(timeRemaining);
        this.cd.detectChanges();
      } else if (timeRemaining === 0) {
        this.store.dispatch(WrittenResponseActions.completeWrittenResponseQuiz());
      }
    }, 1000);
  }

  private updateTimerLabel(timeInSeconds: number): void {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    this.timerLabel = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  public onUserTyping(value: string): void {
    this.store.dispatch(WrittenResponseActions.updateWrittenResponseUserAnswer({ answer: value }));
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  public submitTask(): void {
    const taskId = this.taskId();

    if (!taskId) {
      this.toast.showError('Error', 'Task ID is missing');
      return;
    }

    const answer = this.userAnswer();

    if (!answer || answer.trim().length === 0) {
      this.toast.showError('Error', 'Please provide an answer before submitting');
      return;
    }

    this.store.dispatch(
      WrittenResponseActions.submitWrittenResponseTask({
        taskId: taskId,
        answer: answer,
      }),
    );
  }

  public reviewTask(): void {
    this.store.dispatch(WrittenResponseActions.reviewWrittenResponseTask());
  }
}

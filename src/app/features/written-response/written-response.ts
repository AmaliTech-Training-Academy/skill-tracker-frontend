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
import { Observable, Subscription, take } from 'rxjs';
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
  selectWrittenResponseSubmissionStatus,
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
  public taskTitle$: Observable<string> = this.store.select(selectWrittenResponseTitle);
  public taskDifficulty$: Observable<string> = this.store.select(selectWrittenResponseDifficulty);
  public xpReward$: Observable<number> = this.store.select(selectWrittenResponseXpReward);
  public prompt$: Observable<string | undefined> = this.store.select(selectWrittenResponsePrompt);
  public hints$: Observable<string[]> = this.store.select(selectWrittenResponseHints);
  public userAnswer$: Observable<string> = this.store.select(selectWrittenResponseUserAnswer);
  public loading$: Observable<boolean> = this.store.select(selectWrittenResponseLoading);
  public error$: Observable<string | null> = this.store.select(selectWrittenResponseError);
  public expectedDuration$: Observable<number> = this.store.select(
    selectWrittenResponseExpectedDuration,
  );
  public isSubmitting$: Observable<boolean> = this.store.select(selectWrittenResponseIsSubmitting);
  public submissionStatus$: Observable<string | null> = this.store.select(
    selectWrittenResponseSubmissionStatus,
  );

  public progressValue: number = 0;
  public timerLabel: string = '00:00';
  public quizCompleted: boolean = false;
  private intervalId?: ReturnType<typeof setInterval>;
  private timerSubscription!: Subscription;
  private submissionStatusSubscription!: Subscription;
  private taskId: string | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');

    if (this.taskId) {
      this.store.dispatch(WrittenResponseActions.loadWrittenResponseTask({ taskId: this.taskId }));
    } else {
      this.toast.showError('Task Error', 'The task is not available, try a different task');
      this.router.navigateByUrl('/dashboard/tasks');
      this.store.dispatch(
        WrittenResponseActions.loadWrittenResponseTaskFailure({ error: 'Task ID not provided.' }),
      );
    }

    this.timerSubscription = this.expectedDuration$.pipe(take(1)).subscribe((duration) => {
      if (duration && duration > 0) {
        const totalSeconds = duration * 60;
        this.startTimer(totalSeconds);
      } else {
        this.startTimer(10 * 60);
      }
    });

    this.submissionStatusSubscription = this.submissionStatus$.subscribe((status) => {
      if (status === 'PENDING') {
        this.progressValue = 100;
        this.completeQuiz();
        this.cd.markForCheck();
      }
    });

    this.progressValue = 0;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.submissionStatusSubscription) {
      this.submissionStatusSubscription.unsubscribe();
    }
    this.store.dispatch(WrittenResponseActions.clearWrittenResponseState());
  }

  private startTimer(initialTimeInSeconds: number): void {
    let timeRemaining = initialTimeInSeconds;
    this.updateTimerLabel(timeRemaining);

    this.intervalId = setInterval(() => {
      if (timeRemaining > 0 && !this.quizCompleted) {
        timeRemaining--;
        this.updateTimerLabel(timeRemaining);
        this.cd.detectChanges();
      } else if (timeRemaining === 0) {
        this.completeQuiz();
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
    if (!this.taskId) {
      this.toast.showError('Error', 'Task ID is missing');
      return;
    }

    this.userAnswer$.pipe(take(1)).subscribe((answer) => {
      if (!answer || answer.trim().length === 0) {
        this.toast.showError('Error', 'Please provide an answer before submitting');
        return;
      }

      this.store.dispatch(
        WrittenResponseActions.submitWrittenResponseTask({
          taskId: this.taskId!,
          answer: answer,
        }),
      );
    });
  }

  public reviewTask(): void {
    this.quizCompleted = false;
    this.progressValue = 50;
  }

  private completeQuiz(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.quizCompleted = true;
  }
}

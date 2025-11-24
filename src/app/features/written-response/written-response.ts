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
  selectWrittenResponseSubmission,
  selectWrittenResponseFeedback,
  selectWrittenResponseSubmissionStatus,
} from './store/written-response.selectors';
import * as WrittenResponseActions from './store/written-response.action';
import { TextArea } from './components/text-area/text-area';
import { TaskComplete } from '@app/shared/components/task-complete/task-complete';

const PERCENTAGE_MAX = 100;

export interface FeedbackOverall {
  totalScore?: number;
  maxXP?: number;
  percentage?: number;
  summary?: string;
  keyImprovements?: string[];
}

export interface FeedbackEvaluation {
  overall?: FeedbackOverall;
}

export interface TaskFeedback {
  evaluation?: FeedbackEvaluation;
}

@Component({
  selector: 'app-written-response',
  standalone: true,
  imports: [CommonModule, TextArea, FormsModule, TaskComplete],
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
  public submission = this.store.selectSignal(selectWrittenResponseSubmission);
  public feedback = this.store.selectSignal(selectWrittenResponseFeedback);
  public submissionStatus = this.store.selectSignal(selectWrittenResponseSubmissionStatus);

  public getModalTitle(): string {
    const status = this.submissionStatus();
    const submission = this.submission();

    if (status === 'COMPLETED') {
      return submission?.isCorrect ? 'Task Complete!' : 'Task Failed!';
    }
    if (status === 'PENDING' || status === 'IN_PROGRESS') {
      return 'Processing Submission';
    }
    return 'Task Submitted';
  }

  public getModalMessage(): string {
    const status = this.submissionStatus();
    const submission = this.submission();
    const feedback = this.feedback() as TaskFeedback;

    if (status === 'COMPLETED') {
      if (submission?.isCorrect) {
        return `<strong>Congratulations!</strong> You've earned <strong>+${this.xpReward()} XP</strong> for completing this task successfully.`;
      } else {
        const evaluation = feedback?.evaluation;
        const overall = evaluation?.overall;

        let message = `<strong>Score: ${overall?.totalScore || 0}/${PERCENTAGE_MAX}</strong> (${overall?.percentage || 0}%)<br><br>`;

        if (overall?.summary) {
          const summary = overall.summary;
          const shortSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
          message += `${shortSummary}<br><br>`;
        }

        if (overall?.keyImprovements && overall.keyImprovements.length > 0) {
          const topImprovements = overall.keyImprovements.slice(0, 2);
          message += `<strong>Key Areas to Improve:</strong><br>${topImprovements.map((imp: string) => `• ${imp}`).join('<br>')}`;
        }

        return message;
      }
    }

    if (status === 'PENDING' || status === 'IN_PROGRESS') {
      return 'Getting feedback on your submission. This may take a moment...';
    }

    return 'Your response has been submitted successfully!';
  }

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

  public onTaskComplete(): void {
    this.router.navigateByUrl('/dashboard/tasks');
  }

  public onBackToDashboard(): void {
    this.router.navigateByUrl('/dashboard/tasks');
  }
}

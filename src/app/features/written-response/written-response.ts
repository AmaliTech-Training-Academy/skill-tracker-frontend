import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
} from './store/written-response.selectors';
import * as WrittenResponseActions from './store/written-response.action';
import { TextArea } from './components/text-area/text-area';

@Component({
  selector: 'app-written-response',
  standalone: true,
  imports: [CommonModule, TextArea, FormsModule],
  templateUrl: './written-response.html',
  styleUrls: ['./written-response.scss'],
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
  public expectedDuration$: Observable<number> = this.store.select(selectWrittenResponseExpectedDuration);

  public progressValue: number = 0;
  public timerLabel: string = '00:00';
  public quizCompleted: boolean = false;
  private intervalId?: any;
  private timerSubscription!: Subscription;

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // 1. Get taskId from URL (as requested)
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      this.store.dispatch(WrittenResponseActions.loadWrittenResponseTask({ taskId }));
    } else {
      // Handle case where taskId is missing, e.g., show an error or load a default
      console.error('Task ID not found in route parameters.');
      this.store.dispatch(WrittenResponseActions.loadWrittenResponseTaskFailure({ error: 'Task ID not provided.' }));
    }

    // 2. Start timer logic after task duration is loaded
    this.timerSubscription = this.expectedDuration$.pipe(take(1)).subscribe((duration) => {
      // Convert duration from minutes to seconds
      if (duration && duration > 0) {
    const totalSeconds = duration * 60;
    this.startTimer(totalSeconds);
  } else {
    this.startTimer(10 * 60); // Default to 10 minutes
  }
    });

    // Set initial progress for the drafting stage
    this.progressValue = 0;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
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
    this.store.dispatch(
      WrittenResponseActions.updateWrittenResponseUserAnswer({ answer: value }),
    );
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  public submitTask(): void {
    this.progressValue = 100;
    this.completeQuiz();
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
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { McqQuestion, McqRetrieveRequest } from '@app/core/models/mcq-model';
import { generateMcqQuiz } from '@app/store/mcqs/mcq.actions';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@app/core';
import { Router } from '@angular/router';

import {
  selectMcqQuestions,
  selectMcqTotalTime,
  selectMcqLoading,
  selectMcqError,
} from '@app/store/mcqs/mcq.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';
import { QuizProgress } from '@app/core/models/mcq-model';

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './multiple-choice.html',
  styleUrls: ['./multiple-choice.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleChoice implements OnInit, OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly toastService: ToastService,
    private readonly router: Router,
  ) {}

  private readonly storageKey = 'mcq_quiz_progress';

  private destroy$ = new Subject<void>();

  public questions$ = this.store.select(selectMcqQuestions);
  public loading$ = this.store.select(selectMcqLoading);
  public error$ = this.store.select(selectMcqError);

  public questions: McqQuestion[] = [];
  public currentQuestionIndex: number = 0;
  public selectedAnswers: (number | null)[] = [];
  public isQuizComplete: boolean = false;
  public totalTimeInSeconds: number = 0;
  public timeLeft: number = 0;
  public timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const restored = this.restoreProgress();

    if (!restored) {
      this.dispatchQuizRequest();
    }

    combineLatest([this.questions$, this.store.select(selectMcqTotalTime), this.error$])
      .pipe(
        filter(([questions, totalTime, error]) => (!!questions && questions.length > 0) || !!error),
        map(([questions, totalTime, error]) => ({ questions, totalTime, error })),
        takeUntil(this.destroy$),
      )
      .subscribe(({ questions, totalTime, error }) => {
        if (questions && questions.length > 0 && !restored) {
          this.questions = questions as McqQuestion[];
          this.totalTimeInSeconds = totalTime || 0;
          this.timeLeft = this.totalTimeInSeconds;
          this.selectedAnswers = new Array(this.questions.length).fill(null);
          this.saveProgress();
          this.startTimer();
        } else if (error) {
          console.error('Quiz failed to load:', error);
          this.clearProgress();
        }
        this.cdr.detectChanges();
      });
  }

  public dispatchQuizRequest(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (!taskId) {
      this.toastService.showError('Invalid Task', 'Task was not found. Please try again');
      this.router.navigateByUrl('/dashboard/tasks');
      return;
    }

    const requestPayload: McqRetrieveRequest = {
      taskId: taskId,
    };

    this.store.dispatch(generateMcqQuiz({ request: requestPayload }));
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (!this.isQuizComplete) {
      this.saveProgress();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private saveProgress(): void {
    if (this.questions.length === 0) return;

    const progress: QuizProgress = {
      questions: this.questions,
      currentQuestionIndex: this.currentQuestionIndex,
      selectedAnswers: this.selectedAnswers,
      timeLeft: this.timeLeft,
      totalTimeInSeconds: this.totalTimeInSeconds,
      isQuizComplete: this.isQuizComplete,
      timestamp: Date.now(),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(progress));
   
  }

  private restoreProgress(): boolean {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (!savedData) return false;

      const progress: QuizProgress = JSON.parse(savedData);

      if (progress.isQuizComplete) {
        this.clearProgress();
        return false;
      }

      this.questions = progress.questions;
      this.currentQuestionIndex = progress.currentQuestionIndex;
      this.selectedAnswers = progress.selectedAnswers;
      this.timeLeft = progress.timeLeft;
      this.totalTimeInSeconds = progress.totalTimeInSeconds;
      this.isQuizComplete = progress.isQuizComplete;

      if (!this.isQuizComplete && this.timeLeft > 0) {
        this.startTimer();
      }

      this.cdr.detectChanges();
      return true;
    } catch (error) {
      console.error('Failed to restore quiz progress:', error);
      this.clearProgress();
      return false;
    }
  }

  private clearProgress(): void {
    localStorage.removeItem(this.storageKey);
  }

  private startTimer(): void {
    if (this.totalTimeInSeconds <= 0) return;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0 && !this.isQuizComplete) {
        this.timeLeft--;
        this.saveProgress();
        this.cdr.detectChanges();
      } else if (this.timeLeft === 0 && !this.isQuizComplete) {
        this.completeQuiz();
      }
    }, 1000);
  }

  public get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public get currentQuestion(): McqQuestion {
    return (
      this.questions[this.currentQuestionIndex] || {
        question_number: '',
        question_duration: 0,
        question_text: 'Loading Question...',
        options: [],
        hint: '',
        correct_answer: '',
        explanation: '',
      }
    );
  }

  public get questionTrack(): string {
    if (this.questions.length === 0) return 'Question 0 / 0';
    return `Question ${this.currentQuestionIndex + 1} / ${this.questions.length}`;
  }

  public get progressValue(): number {
    if (this.questions.length === 0) return 0;
    if (this.isQuizComplete) return 100;
    const completedQuestions = Math.min(this.currentQuestionIndex, this.questions.length);
    return (completedQuestions / this.questions.length) * 100;
  }

  public selectOption(optionIndex: number): void {
    if (!this.isQuizComplete) {
      this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
      this.saveProgress();
      this.cdr.markForCheck();
    }
  }

  public isOptionSelected(optionIndex: number): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] === optionIndex;
  }

  public getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  public nextQuestion(): void {
    if (!this.isQuizComplete) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.saveProgress();
      } else if (
        this.currentQuestionIndex === this.questions.length - 1 &&
        this.selectedAnswers[this.currentQuestionIndex] !== null
      ) {
        this.completeQuiz();
      }
    } else {
      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestionIndex++;
        this.saveProgress();
      } else {
        this.currentQuestionIndex = 0;
        this.saveProgress();
      }
    }
    this.cdr.markForCheck();
  }

  public previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.saveProgress();
    }
    this.cdr.markForCheck();
  }

  public get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  public get canGoNext(): boolean {
    if (!this.isQuizComplete) {
      if (this.questions.length === 0) return false;
      return this.selectedAnswers[this.currentQuestionIndex] !== null;
    }
    return true;
  }

  public completeQuiz() {
    this.isQuizComplete = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.currentQuestionIndex = this.questions.length;
    this.saveProgress();
    setTimeout(() => {
      this.clearProgress();
    }, 100);
    this.cdr.markForCheck();
  }

  public resetQuiz(): void {
    this.clearProgress();
    this.currentQuestionIndex = 0;
    this.selectedAnswers = [];
    this.isQuizComplete = false;
    this.timeLeft = 0;
    this.questions = [];
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.dispatchQuizRequest();
    this.cdr.markForCheck();
  }

  public get score(): number {
    return this.questions.reduce<number>((score: number, question: McqQuestion, index: number) => {
      const selectedOptionIndex = this.selectedAnswers[index];
      const selectedOptionText =
        selectedOptionIndex !== null && question.options
          ? question.options[selectedOptionIndex]
          : null;

      if (selectedOptionText === question.correct_answer) {
        return score + 1;
      }
      return score;
    }, 0);
  }

  public isCorrectAnswer(optionIndex: number): boolean {
    if (!this.currentQuestion || !this.currentQuestion.options) return false;

    return this.currentQuestion.options[optionIndex] === this.currentQuestion.correct_answer;
  }
}

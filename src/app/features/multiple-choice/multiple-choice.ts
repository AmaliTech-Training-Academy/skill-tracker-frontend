import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { McqQuestion, McqGenerationRequest } from '@app/core/models/mcq-model'; 
import { generateMcqQuiz } from '@app/store/mcqs/mcq.actions';
import {
  selectMcqQuestions,
  selectMcqTotalTime,
  selectMcqLoading,
  selectMcqError} from '@app/store/mcqs/mcq.selectors';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-multiple-choice',
  standalone: true, 
  imports: [CommonModule, AsyncPipe],
  templateUrl: './multiple-choice.html',
  styleUrls: ['./multiple-choice.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleChoice implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  
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
  public timerInterval: any;

  ngOnInit(): void {
    this.dispatchQuizRequest();

    combineLatest([
        this.questions$,
        this.store.select(selectMcqTotalTime),
        this.error$
      ])
        .pipe(
          // Filter ensures we only proceed if we have valid questions or an error
          filter(([questions, totalTime, error]) => 
            (!!questions && questions.length > 0) || !!error
          ),
          map(([questions, totalTime, error]) => ({ questions, totalTime, error })),
          takeUntil(this.destroy$),
        )
        .subscribe(({ questions, totalTime, error }) => {
          if (questions && questions.length > 0) {
            // CRITICAL: Update local state properties
            this.questions = questions as McqQuestion[];
            this.totalTimeInSeconds = totalTime || 0; 
            this.timeLeft = this.totalTimeInSeconds;
            // Initialize selectedAnswers array based on the number of questions
            this.selectedAnswers = new Array(this.questions.length).fill(null);
            this.startTimer();
          } else if (error) {
             console.error('Quiz failed to load:', error);
          }
          // CRITICAL: Explicitly call detectChanges to trigger a view update 
          // now that local state (this.questions) has changed.
          // Note: The previous redundant call was removed here.
          this.cdr.detectChanges(); 
        });
  }

  public dispatchQuizRequest(): void {
    const requestPayload: McqGenerationRequest = {
      userId: 'mock-user-id-12345',
      interest: 'Database', 
      difficulty: 'intermediate',
      no_of_questions: 10,
    };
    this.store.dispatch(generateMcqQuiz({ request: requestPayload }));
    // Mark for check immediately after dispatching to ensure 'loading' is visible
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTimer(): void {
    if (this.totalTimeInSeconds <= 0) return; 

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0 && !this.isQuizComplete) {
        this.timeLeft--;
        // FIX: Explicitly tell Angular to check the view after updating timeLeft
        this.cdr.detectChanges(); 
      } else if (this.timeLeft === 0 && !this.isQuizComplete) {
        this.completeQuiz();
        // Since completeQuiz() calls cdr.markForCheck(), no need for another detectChanges here
      }
    }, 1000);
  }

  public get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  public get currentQuestion(): McqQuestion {
    // Safely return a placeholder if questions array is not yet populated
    return this.questions[this.currentQuestionIndex] || {
        question_number: '',
        question_duration: 0,
        question_text: 'Loading Question...',
        options: [],
        hint: '',
        correct_answer: '',
        explanation: ''
    };
  }

  public get questionTrack(): string {
    if (this.questions.length === 0) return 'Question 0 / 0';
    return `Question ${this.currentQuestionIndex + 1} / ${
      this.questions.length
    }`;
  }

  public get progressValue(): number {
    if (this.questions.length === 0) return 0;
    
    // Lock progress bar to 100% when the quiz is complete
    if (this.isQuizComplete) return 100;
    
    const completedQuestions = Math.min(this.currentQuestionIndex, this.questions.length);
    return (completedQuestions / this.questions.length) * 100;
  }

  public selectOption(optionIndex: number): void {
    if (!this.isQuizComplete) {
      this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
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
      // Logic for moving to the next question during active quiz mode
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else if (
        this.currentQuestionIndex === this.questions.length - 1 &&
        this.selectedAnswers[this.currentQuestionIndex] !== null
      ) {
        this.completeQuiz();
      }
    } else {
      // Logic for moving to the next question during review mode
      if (this.currentQuestionIndex < this.questions.length) {
        this.currentQuestionIndex++;
      } else {
        // Cycle back to the first question for review
        this.currentQuestionIndex = 0;
      }
    }
    this.cdr.markForCheck(); 
  }

  public previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
    this.cdr.markForCheck(); 
  }

  public get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  public get canGoNext(): boolean {
    if (!this.isQuizComplete) {
      if (this.questions.length === 0) return false;
      // During the quiz, must have an answer selected to proceed
      return this.selectedAnswers[this.currentQuestionIndex] !== null;
    }
    // During review, always allow the 'Next' button to be active
    return true; 
  }

  public completeQuiz() {
    this.isQuizComplete = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    // Set index to length to display the summary page
    this.currentQuestionIndex = this.questions.length; 
    this.cdr.markForCheck(); 
  }

  public get score(): number {
    return this.questions.reduce<number>(
      (score: number, question: McqQuestion, index: number) => {
        const selectedOptionIndex = this.selectedAnswers[index];
        const selectedOptionText =
          selectedOptionIndex !== null && question.options
            ? question.options[selectedOptionIndex]
            : null;

        if (selectedOptionText === question.correct_answer) {
          return score + 1;
        }
        return score;
      },
      0,
    );
  }

  public isCorrectAnswer(optionIndex: number): boolean {
    if (!this.currentQuestion || !this.currentQuestion.options) return false;
    
    return (
      this.currentQuestion.options[optionIndex] ===
      this.currentQuestion.correct_answer
    );
  }
}
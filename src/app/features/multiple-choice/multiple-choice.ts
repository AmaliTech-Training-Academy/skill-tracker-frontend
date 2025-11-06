import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

@Component({
  selector: 'app-multiple-choice',
  imports: [],
  templateUrl: './multiple-choice.html',
  styleUrl: './multiple-choice.scss',
})
export class MultipleChoice implements OnInit, OnDestroy {
    
  // Inject ChangeDetectorRef to manually trigger view updates for the timer
  constructor(private cdr: ChangeDetectorRef) {} 

  questions: Question[] = [
    {
      id: 1,
      question: 'What will the following Python code print?\nx=5\nif x > 3:\n    print("A")\nelse:\n    print("B")',
      options: ['A', 'B', 'Both A and B', 'Error'],
      correctAnswer: 0,
      hint: 'Check if the condition x > 3 is True or False.',
      explanation: 'Since x = 5 and 5 > 3 is True, the code will print "A".'
    },
    {
      id: 2,
      question: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswer: 1,
      hint: 'Think about the anchor element in HTML.',
      explanation: 'The <a> tag is used to create hyperlinks in HTML.'
    },
    {
      id: 3,
      question: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
      correctAnswer: 1,
      hint: 'The "C" stands for a term that describes how styles flow down.',
      explanation: 'CSS stands for Cascading Style Sheets, which describes how styles cascade through HTML elements.'
    }
    
  ];

  currentQuestionIndex = 0;
  selectedAnswers: (number | null)[] = new Array(this.questions.length).fill(null);
  isQuizComplete = false;
  
  // Timer properties
  totalTimeInSeconds = 900; // 15 minutes = 900 seconds
  remainingTime = 900;
  timerInterval: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0 && !this.isQuizComplete) {
        this.remainingTime--;
        // Force view update for the timer
        this.cdr.detectChanges(); 
      } else if (this.remainingTime === 0) {
        this.completeQuiz();
        // Force view update for completion screen
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get progressValue(): number {
    // Progress calculation remains based on question submission
    return ((this.selectedAnswers.filter(a => a !== null).length) / this.questions.length) * 100;
  }

  get questionTrack(): string {
    return `Question ${this.currentQuestionIndex + 1} out of ${this.questions.length}`;
  }

  selectOption(optionIndex: number) {
    if (!this.isQuizComplete) {
      this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
    }
  }

  isOptionSelected(optionIndex: number): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] === optionIndex;
  }
  
  // Method to check if an option is the correct answer
  isCorrectAnswer(optionIndex: number): boolean {
    return this.currentQuestion.correctAnswer === optionIndex;
  }

  nextQuestion() {
    if (!this.isQuizComplete) {
      // Quiz Mode: Advance or Complete
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.completeQuiz();
      }
    } else {
      // Review Mode: Advance, or start review from the first question if currently on the summary screen
      if (this.currentQuestionIndex === this.questions.length) {
        // We are on the summary screen, clicking next starts the review from Q1
        this.currentQuestionIndex = 0;
      } else if (this.currentQuestionIndex < this.questions.length - 1) {
        // We are reviewing, advance to the next question
        this.currentQuestionIndex++;
      } else if (this.currentQuestionIndex === this.questions.length - 1) {
        // We are reviewing the last question, clicking next goes back to the summary screen
        this.currentQuestionIndex++;
      }
    }
  }

  previousQuestion() {
    // In any mode, go back one question, provided we are not past the first question.
    // If on the summary screen (index == length), this takes us to the last question (index == length - 1).
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  get canGoNext(): boolean {
    // In quiz mode, can go next only if an answer is selected.
    if (!this.isQuizComplete) {
        return this.selectedAnswers[this.currentQuestionIndex] !== null;
    }
    // In review mode, we can always click next unless we are past the last question index (i.e., on the summary screen).
    // However, for the summary screen (index === length), we explicitly enable 'Next' to start review.
    return this.currentQuestionIndex <= this.questions.length;
  }

  completeQuiz() {
    this.isQuizComplete = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    // Set index to the length of the array to display the 'Quiz Complete' summary screen
    this.currentQuestionIndex = this.questions.length; 
  }

  get score(): number {
    return this.selectedAnswers.reduce<number>((score: number, answer: number | null, index: number) => {
      return answer === this.questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
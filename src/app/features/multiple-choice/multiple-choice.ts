import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleChoice implements OnInit, OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}

  public questions: Question[] = [
    {
      id: 1,
      question:
        'What will the following Python code print?\nx=5\nif x > 3:\n    print("A")\nelse:\n    print("B")',
      options: ['A', 'B', 'Both A and B', 'Error'],
      correctAnswer: 0,
      hint: 'Check if the condition x > 3 is True or False.',
      explanation: 'Since x = 5 and 5 > 3 is True, the code will print "A".',
    },
    {
      id: 2,
      question: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswer: 1,
      hint: 'Think about the anchor element in HTML.',
      explanation: 'The <a> tag is used to create hyperlinks in HTML.',
    },
    {
      id: 3,
      question: 'What does CSS stand for?',
      options: [
        'Computer Style Sheets',
        'Cascading Style Sheets',
        'Creative Style Sheets',
        'Colorful Style Sheets',
      ],
      correctAnswer: 1,
      hint: 'The "C" stands for a term that describes how styles flow down.',
      explanation:
        'CSS stands for Cascading Style Sheets, which describes how styles cascade through HTML elements.',
    },
    {
      id: 4,
      question: 'In JavaScript, what is the result of typeof [] ?',
      options: ['array', 'object', 'undefined', 'number'],
      correctAnswer: 1,
      hint: 'Arrays are a specialized object in JS.',
      explanation: 'In JavaScript, arrays are objects, so typeof [] returns "object".',
    },
    {
      id: 5,
      question: 'In TypeScript, what is the primary purpose of an "interface"?',
      options: [
        'Define a type contract for objects/classes',
        'Execute code at runtime',
        'Create a standalone module',
        'Automatically compile to JS',
      ],
      correctAnswer: 0,
      hint: 'Think design-time type checking and structural typing.',
      explanation:
        'An interface defines a compile-time contract describing object shapes and expected members.',
    },
    {
      id: 6,
      question: 'Which Angular decorator is used to define a component?',
      options: ['@Component', '@NgModule', '@Injectable', '@Directive'],
      correctAnswer: 0,
      hint: 'This decorator provides template and metadata for a view.',
      explanation:
        '@Component is the decorator used to declare Angular components and their metadata (template, styles, selector).',
    },
    {
      id: 7,
      question: 'Which git command creates a new branch and switches to it in one step?',
      options: ['git branch <name>', 'git checkout -b <name>', 'git clone <repo>', 'git init'],
      correctAnswer: 1,
      hint: 'One command both creates and checks out the branch.',
      explanation:
        'git checkout -b <name> creates the branch <name> and immediately checks it out.',
    },
    {
      id: 8,
      question: 'Which SQL query returns all users older than 30 from the users table?',
      options: [
        'SELECT * FROM users WHERE age > 30;',
        'SELECT age FROM users;',
        'SELECT * FROM users LIMIT 30;',
        'SELECT users FROM age > 30;',
      ],
      correctAnswer: 0,
      hint: 'Use WHERE to filter rows by a condition.',
      explanation:
        'Use SELECT * FROM users WHERE age > 30; to retrieve all columns for users with age greater than 30.',
    },
    {
      id: 9,
      question: 'What is the time complexity of binary search on a sorted array of n elements?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
      correctAnswer: 2,
      hint: 'Binary search halves the search space each step.',
      explanation:
        'Binary search reduces the search interval by half each step, yielding O(log n) time complexity.',
    },
    {
      id: 10,
      question: 'Which Linux command lists files including hidden files?',
      options: ['ls', 'ls -l', 'ls -a', 'list'],
      correctAnswer: 2,
      hint: 'Hidden files start with a dot; include them with a flag.',
      explanation: 'ls -a lists all files including hidden ones (those starting with a dot).',
    },
  ];

  public currentQuestionIndex = 0;
  public selectedAnswers: (number | null)[] = new Array(this.questions.length).fill(null);
  public isQuizComplete = false;

  public totalTimeInSeconds = 900;
  public remainingTime = 900;
  public timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  public startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.remainingTime > 0 && !this.isQuizComplete) {
        this.remainingTime--;
        this.cdr.detectChanges();
      } else if (this.remainingTime === 0) {
        this.completeQuiz();
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  public get formattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  public get progressValue(): number {
    return (this.selectedAnswers.filter((a) => a !== null).length / this.questions.length) * 100;
  }

  public get questionTrack(): string {
    return `Question ${this.currentQuestionIndex + 1} out of ${this.questions.length}`;
  }

  public selectOption(optionIndex: number) {
    if (!this.isQuizComplete) {
      this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
    }
  }

  public isOptionSelected(optionIndex: number): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] === optionIndex;
  }

  public isCorrectAnswer(optionIndex: number): boolean {
    return this.currentQuestion.correctAnswer === optionIndex;
  }

  public nextQuestion() {
    if (!this.isQuizComplete) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.completeQuiz();
      }
    } else {
      if (this.currentQuestionIndex === this.questions.length) {
        this.currentQuestionIndex = 0;
      } else if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else if (this.currentQuestionIndex === this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    }
  }

  public previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  public get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  public get canGoNext(): boolean {
    if (!this.isQuizComplete) {
      return this.selectedAnswers[this.currentQuestionIndex] !== null;
    }
    return this.currentQuestionIndex <= this.questions.length;
  }

  public completeQuiz() {
    this.isQuizComplete = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.currentQuestionIndex = this.questions.length;
  }

  public get score(): number {
    return this.selectedAnswers.reduce<number>(
      (score: number, answer: number | null, index: number) => {
        return answer === this.questions[index].correctAnswer ? score + 1 : score;
      },
      0,
    );
  }

  public getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}

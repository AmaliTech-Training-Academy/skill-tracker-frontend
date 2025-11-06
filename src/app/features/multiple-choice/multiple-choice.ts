import { Component, OnInit, OnDestroy } from '@angular/core';

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
    },
    {
      id: 4,
      question: 'Which JavaScript method is used to add an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 0,
      hint: 'Think about pushing something onto a stack.',
      explanation: 'The push() method adds elements to the end of an array.'
    },
    {
      id: 5,
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['variable x = 5', 'let x = 5', 'v x = 5', 'var: x = 5'],
      correctAnswer: 1,
      hint: 'Modern JavaScript uses keywords like let, const, or var.',
      explanation: 'let x = 5 is the correct modern syntax for declaring variables in JavaScript.'
    },
    {
      id: 6,
      question: 'Which HTTP status code indicates a successful request?',
      options: ['404', '500', '200', '301'],
      correctAnswer: 2,
      hint: 'Think of the most common success response.',
      explanation: '200 OK is the standard HTTP status code for a successful request.'
    },
    {
      id: 7,
      question: 'What does API stand for?',
      options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Programming Interface'],
      correctAnswer: 0,
      hint: 'It\'s about how applications communicate with each other.',
      explanation: 'API stands for Application Programming Interface.'
    },
    {
      id: 8,
      question: 'Which symbol is used for comments in Python?',
      options: ['//', '/* */', '#', '<!-- -->'],
      correctAnswer: 2,
      hint: 'Think of the hash symbol.',
      explanation: 'Python uses # for single-line comments.'
    },
    {
      id: 9,
      question: 'What is the default port for HTTP?',
      options: ['443', '8080', '80', '3000'],
      correctAnswer: 2,
      hint: 'It\'s a two-digit number.',
      explanation: 'Port 80 is the default port for HTTP connections.'
    },
    {
      id: 10,
      question: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Array', 'Tree'],
      correctAnswer: 1,
      hint: 'Think of stacking plates.',
      explanation: 'A Stack data structure follows the LIFO principle - the last element added is the first one removed.'
    }
  ];

  currentQuestionIndex = 0;
  selectedAnswers: (number | null)[] = new Array(10).fill(null);
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
      } else if (this.remainingTime === 0) {
        this.completeQuiz();
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
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
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

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.completeQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  get canGoNext(): boolean {
    return this.selectedAnswers[this.currentQuestionIndex] !== null;
  }

  completeQuiz() {
    this.isQuizComplete = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  get score(): number {
    return this.selectedAnswers.reduce<number>((score: number, answer: number | null, index: number) => {
      return answer === this.questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }
}
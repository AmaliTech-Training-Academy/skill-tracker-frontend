import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextArea } from './components/text-area/text-area';
import { FormsModule } from '@angular/forms';

interface Question {
  questionId: string;
  question: string;
  hint: string;
}

interface QuestionSet {
  timerInSeconds: number;
  questions: Question[];
}

@Component({
  selector: 'app-written-response',
  standalone: true,
  imports: [CommonModule, TextArea, FormsModule],
  templateUrl: './written-response.html',
  styleUrls: ['./written-response.scss']
})
export class WrittenResponse implements OnInit {
  questionSet: QuestionSet = {
    timerInSeconds: 300,
    questions: [
      { questionId: '1', question: 'What is this?', hint: 'wwwwwwwwwwwww' },
      { questionId: '2', question: 'What does HTML stand for?', hint: 'It is the standard markup language for creating web pages.' },
      { questionId: '3', question: 'What is the purpose of CSS?', hint: 'It is used to style and layout web pages.' },
      { questionId: '4', question: 'What is TypeScript?', hint: 'It is a superset of JavaScript that adds static typing.' },
      { questionId: '5', question: 'What is Angular primarily used for?', hint: 'It is a framework for building single-page applications.' }
    ]
  };

  currentQuestionIndex = 0;
  progressValue = 0;
  timeRemaining = this.questionSet.timerInSeconds;
  timerLabel = '00:00';
  quizCompleted = false;
  private intervalId?: any;
  userAnswer: string = '';
  userAnswers: { [key: string]: string } = {};

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateTimerLabel();
    this.startTimer();
    this.updateProgress();
    this.loadCurrentAnswer();
  }

  private startTimer(): void {
    this.intervalId = setInterval(() => {
      if (this.timeRemaining > 0 && !this.quizCompleted) {
        this.timeRemaining--;
        this.updateTimerLabel();
        this.cd.detectChanges();
      } else if (this.timeRemaining === 0) {
        this.completeQuiz();
      }
    }, 1000);
  }

  private updateTimerLabel(): void {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerLabel = `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  onUserTyping(value: string): void {
    this.userAnswer = value;
    this.userAnswers[this.questionSet.questions[this.currentQuestionIndex].questionId] = value;
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  get isPrevDisabled(): boolean {
    return this.currentQuestionIndex === 0;
  }

  get isNextDisabled(): boolean {
    if (this.quizCompleted) return false;
    const currentQuestionId = this.questionSet.questions[this.currentQuestionIndex].questionId;
    const answer = this.userAnswers[currentQuestionId] || '';
    return answer.trim() === '';
  }

  get questionTrackerLabel(): string {
    const currentNumber = this.currentQuestionIndex + 1;
    const totalQuestions = this.questionSet.questions.length;
    return `Question ${currentNumber} out of ${totalQuestions}`;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questionSet.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentAnswer();
      this.updateProgress();
    } else {
      this.completeQuiz();
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadCurrentAnswer();
      this.updateProgress();
    }
  }

  private loadCurrentAnswer(): void {
    const currentQuestionId = this.questionSet.questions[this.currentQuestionIndex].questionId;
    this.userAnswer = this.userAnswers[currentQuestionId] || '';
  }

  private updateProgress(): void {
    const progress = ((this.currentQuestionIndex + 1) / this.questionSet.questions.length) * 100;
    this.progressValue = Math.round(progress);
  }

  private completeQuiz(): void {
    clearInterval(this.intervalId);
    this.quizCompleted = true;
    this.progressValue = 100;
  }
}
//THIS IS A MOCK SERVICE, IT WILL BE DISCARDED LATER

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { McqResponse, McqQuestion } from '@app/core/models/mcq-model';
import { ToastService } from '@app/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class McqMockService {
  private mockQuizzes: { [key: string]: McqQuestion[] } = {
    ef457756648836664: [
      {
        question_number: '1',
        question_duration: 30,
        question_text: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        hint: 'Think of the Eiffel Tower',
        correct_answer: 'Paris',
        explanation: 'Paris is the capital and most populous city of France.',
      },
      {
        question_number: '2',
        question_duration: 45,
        question_text: 'Which programming language is primarily used for Android development?',
        options: ['Swift', 'Kotlin', 'Python', 'Ruby'],
        hint: 'It runs on the JVM',
        correct_answer: 'Kotlin',
        explanation:
          'Kotlin is the preferred language for Android development, officially supported by Google.',
      },
      {
        question_number: '3',
        question_duration: 40,
        question_text: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language',
        ],
        hint: "It's used to structure web pages",
        correct_answer: 'Hyper Text Markup Language',
        explanation:
          'HTML stands for Hyper Text Markup Language and is the standard markup language for creating web pages.',
      },
      {
        question_number: '4',
        question_duration: 35,
        question_text: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        hint: 'Named after the Roman god of war',
        correct_answer: 'Mars',
        explanation:
          'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.',
      },
      {
        question_number: '5',
        question_duration: 50,
        question_text: 'In Angular, what is the purpose of NgRx?',
        options: ['Styling components', 'State management', 'Routing', 'HTTP requests'],
        hint: 'It helps manage application data',
        correct_answer: 'State management',
        explanation:
          'NgRx is a framework for building reactive applications in Angular using state management patterns inspired by Redux.',
      },
    ],
    'mock-user-id-12345': [
      {
        question_number: '1',
        question_duration: 40,
        question_text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        hint: 'It divides the search space in half each time',
        correct_answer: 'O(log n)',
        explanation:
          'Binary search has a time complexity of O(log n) because it halves the search space with each iteration.',
      },
      {
        question_number: '2',
        question_duration: 35,
        question_text: 'Which CSS property is used to change text color?',
        options: ['font-color', 'text-color', 'color', 'foreground-color'],
        hint: "It's a simple, short property name",
        correct_answer: 'color',
        explanation: 'The CSS "color" property is used to set the color of text content.',
      },
      {
        question_number: '3',
        question_duration: 45,
        question_text: 'What does API stand for?',
        options: [
          'Application Programming Interface',
          'Advanced Programming Integration',
          'Application Process Integration',
          'Automated Programming Interface',
        ],
        hint: 'It allows different software to communicate',
        correct_answer: 'Application Programming Interface',
        explanation:
          'API stands for Application Programming Interface, which allows different software applications to communicate with each other.',
      },
      {
        question_number: '4',
        question_duration: 30,
        question_text: 'Which HTTP method is used to update a resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        hint: 'Think about replacing existing data',
        correct_answer: 'PUT',
        explanation:
          'PUT is the HTTP method typically used to update an existing resource on the server.',
      },
    ],
    // Add more mock quiz sets with different IDs as needed
    'quiz-angular-basics': [
      {
        question_number: '1',
        question_duration: 40,
        question_text: 'What is Angular CLI used for?',
        options: [
          'Database management',
          'Project scaffolding and development',
          'Server deployment',
          'Testing only',
        ],
        hint: 'It helps create and manage Angular projects',
        correct_answer: 'Project scaffolding and development',
        explanation:
          'Angular CLI is a command-line interface tool for initializing, developing, and maintaining Angular applications.',
      },
      {
        question_number: '2',
        question_duration: 35,
        question_text: 'What is the purpose of the @Component decorator?',
        options: [
          'To create a service',
          'To define component metadata',
          'To inject dependencies',
          'To create a pipe',
        ],
        hint: 'It provides information about the component',
        correct_answer: 'To define component metadata',
        explanation:
          'The @Component decorator is used to define metadata for a component, including its selector, template, and styles.',
      },
      {
        question_number: '3',
        question_duration: 45,
        question_text: 'Which Angular feature allows you to share data between components?',
        options: ['Directives', 'Services', 'Pipes', 'Modules'],
        hint: 'It can be injected into multiple components',
        correct_answer: 'Services',
        explanation:
          'Services are singleton objects in Angular that can be injected into multiple components to share data and functionality.',
      },
    ],
  };

  constructor(
    private toastService: ToastService,
    private router: Router,
  ) {}

  public generateQuiz(taskId: string): Observable<McqResponse> {
    // Simulate network delay (500-1500ms)
    const networkDelay = Math.floor(Math.random() * 1000) + 500;

    const questions = this.mockQuizzes[taskId];

    if (!questions) {
      // Return error response if taskId not found
      this.toastService.showError('Quize Error', 'Task could not be found. Try again');
      this.router.navigateByUrl('dashboard/tasks');

      return of({
        success: false,
        message: `Quiz not found for taskId: ${taskId}`,
        data: {
          mcqQuestion: [],
        },
        metadata: {
          timestamp: new Date().toISOString(),
          traceId: this.generateTraceId(),
        },
      }).pipe(delay(networkDelay));
    }

    // Return success response
    return of({
      success: true,
      message: 'Quiz retrieved successfully',
      data: {
        mcqQuestion: questions,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        traceId: this.generateTraceId(),
      },
    }).pipe(delay(networkDelay));
  }

  /**
   * Generate a random trace ID for mock responses
   */
  private generateTraceId(): string {
    return `mock-trace-${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Helper method to add more mock quizzes dynamically
   */
  public addMockQuiz(taskId: string, questions: McqQuestion[]): void {
    this.mockQuizzes[taskId] = questions;
  }

  /**
   * Helper method to get all available mock quiz IDs
   */
  public getAvailableQuizIds(): string[] {
    return Object.keys(this.mockQuizzes);
  }
}

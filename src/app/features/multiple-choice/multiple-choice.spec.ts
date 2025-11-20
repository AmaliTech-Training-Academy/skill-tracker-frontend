import { TestBed } from '@angular/core/testing';
import { MultipleChoice } from './multiple-choice';
import { ChangeDetectorRef } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@app/core';
import { of } from 'rxjs';
import { McqQuestion } from '@app/core/models/mcq-model';

class MockRouter {
  navigateByUrl(url: string): void {}
}

class MockToastService {
  showError(title: string, message: string): void {}
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string): string | null => '123',
    },
  };
}

describe('MultipleChoice Component', () => {
  let component: MultipleChoice;
  let store: MockStore;
  let mockCdr: ChangeDetectorRef;

  beforeEach(() => {
    mockCdr = {
      detectChanges: jest.fn(),
      markForCheck: jest.fn(),
    } as unknown as ChangeDetectorRef;

    TestBed.configureTestingModule({
      imports: [MultipleChoice],
      providers: [
        provideMockStore({
          initialState: {},
        }),
        { provide: Router, useClass: MockRouter },
        { provide: ToastService, useClass: MockToastService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ChangeDetectorRef, useValue: mockCdr },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    const fixture = TestBed.createComponent(MultipleChoice);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct formatted time', () => {
    component.timeLeft = 75; // 01:15
    expect(component.formattedTime).toBe('01:15');
  });

  it('should return correct option label', () => {
    expect(component.getOptionLabel(1)).toBe('B');
    expect(component.getOptionLabel(4)).toBe('E');
  });

  it('should correctly select option and mark it as selected', () => {
    component.selectedAnswers = [null];
    component.currentQuestionIndex = 0;

    component.selectOption(2);

    expect(component.selectedAnswers[0]).toBe(2);
    expect(component.isOptionSelected(2)).toBe(true);
  });

  it('should calculate progress value', () => {
    component.questions = [{} as McqQuestion, {} as McqQuestion, {} as McqQuestion];
    component.currentQuestionIndex = 1;

    expect(component.progressValue).toBeCloseTo(33.333, 0);
  });

  it('should return currentQuestion fallback when no questions', () => {
    component.questions = [];
    const q = component.currentQuestion;
    expect(q.question_text).toBe('Loading Question...');
    expect(q.options).toEqual([]);
  });

  it('should compute quiz score correctly', () => {
    component.questions = [
      { correct_answer: 'A', options: ['A', 'B'], question_text: '' },
      { correct_answer: 'B', options: ['A', 'B'], question_text: '' },
      { correct_answer: 'C', options: ['C', 'D'], question_text: '' },
    ] as McqQuestion[];

    component.selectedAnswers = [0, 1, null]; // Correct, Correct, Unanswered

    expect(component.score).toBe(2);
  });

  it('should correctly identify correct answer', () => {
    component.questions = [
      { correct_answer: 'B', options: ['A', 'B', 'C'], question_text: '' },
    ] as McqQuestion[];

    component.currentQuestionIndex = 0;

    expect(component.isCorrectAnswer(1)).toBe(true);
    expect(component.isCorrectAnswer(0)).toBe(false);
  });

  it('should allow navigating to next when answer selected', () => {
    component.questions = [{} as McqQuestion];
    component.selectedAnswers = [1];

    expect(component.canGoNext).toBe(true);
  });

  it('should prevent navigating next if no answer selected', () => {
    component.questions = [{} as McqQuestion];
    component.selectedAnswers = [null];

    expect(component.canGoNext).toBe(false);
  });

  it('should complete quiz properly', () => {
    component.questions = [{} as McqQuestion, {} as McqQuestion];
    component.currentQuestionIndex = 1;

    component.completeQuiz();

    expect(component.isQuizComplete).toBe(true);
    expect(component.currentQuestionIndex).toBe(2);
  });
});

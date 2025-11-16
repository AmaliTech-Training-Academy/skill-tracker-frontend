import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ChallengeDescription } from './challenge-description';
import { Task, TaskType, TaskContentType, TaskDifficulty } from '@app/core/models/tasks-model';
import { signal } from '@angular/core';

describe('ChallengeDescription', () => {
  let component: ChallengeDescription;
  let fixture: ComponentFixture<ChallengeDescription>;

  const mockTask: Task = {
    id: 't1',
    title: 'Test Task',
    description: 'Test description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: {
      contentType: TaskContentType.CODING,
      prompt: 'Test prompt',
      examples: [
        {
          input: 'test input',
          output: 'test output',
          explanation: 'test explanation',
        },
      ],
      constraints: 'Test constraints',
      starterCode: 'console.log("test");',
      testCases: [],
      evaluationCriteria: {
        correctness: [],
        efficiency: [],
        style: [],
      },
      hints: [],
    },
    xpReward: 50,
    estimatedDuration: 15,
    skillName: 'JavaScript',
    version: 1,
  };

  const mockStore = {
    selectSignal: jest.fn().mockReturnValue(signal('15:00')),
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDescription],
      providers: [{ provide: Store, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeDescription);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted time', () => {
    expect(component.displayTime()).toBe('15:00');
  });

  it('should emit startTask when onStartClick is called', () => {
    const emitSpy = jest.spyOn(component.startTask, 'emit');
    component.onStartClick();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should display task title and description', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Task');
    expect(compiled.textContent).toContain('Test description');
  });
});

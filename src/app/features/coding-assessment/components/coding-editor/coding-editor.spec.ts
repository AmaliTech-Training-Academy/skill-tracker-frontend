import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { CodingEditor } from './coding-editor';
import { Task, TaskType, TaskContentType, TaskDifficulty } from '@app/core/models/tasks-model';

describe('CodingEditor', () => {
  let component: CodingEditor;
  let fixture: ComponentFixture<CodingEditor>;

  const mockTask: Task = {
    id: 't1',
    title: 'Test Task',
    description: 'Test description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: {
      contentType: TaskContentType.CODING,
      prompt: 'Test prompt',
      examples: [],
      constraints: 'Test constraints',
      starterCode: 'console.log("Hello World");',
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
      imports: [CodingEditor],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingEditor);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract starter code from task', () => {
    expect(component.initialCode()).toBe('console.log("Hello World");');
  });

  it('should derive language from skill name', () => {
    expect(component.language()).toBe('javascript');
  });

  it('should emit code changes', () => {
    const emitSpy = jest.spyOn(component.codeChanged, 'emit');
    component.onCodeChange('new code');
    expect(emitSpy).toHaveBeenCalledWith('new code');
  });

  it('should emit run code event', () => {
    const emitSpy = jest.spyOn(component.runCode, 'emit');
    component.codeContent.set('test code');
    component.onRunCode();
    expect(emitSpy).toHaveBeenCalledWith('test code');
  });
});

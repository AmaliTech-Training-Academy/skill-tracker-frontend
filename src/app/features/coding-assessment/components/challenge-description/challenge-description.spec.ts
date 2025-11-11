import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeDescription } from './challenge-description';
import { CodingTask } from '@app/core/models/tasks-model';

describe('ChallengeDescription', () => {
  let component: ChallengeDescription;
  let fixture: ComponentFixture<ChallengeDescription>;

  const mockTask: CodingTask = {
    id: 't1',
    title: 'Test Task',
    description: 'Test description',
    examples: [
      {
        input: 'test input',
        output: 'test output',
        explanation: 'test explanation',
      },
    ],
    skill: 'JavaScript',
    difficulty: 'Beginner',
    estimatedDuration: 15,
    starterCode: 'console.log("test");',
    language: 'JavaScript',
    xp: 50,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDescription],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeDescription);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted estimated time', () => {
    expect(component.estimatedTime()).toBe('15:00');
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

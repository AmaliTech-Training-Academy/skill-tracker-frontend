import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksCard } from './tasks-card';
import {
  TaskUI,
  TaskIcon,
  TaskType,
  TaskDifficulty,
  TaskStatus,
  TaskContentType,
} from '@app/core/models/tasks-model';

describe('TasksCard', () => {
  let component: TasksCard;
  let fixture: ComponentFixture<TasksCard>;

  const mockTask: TaskUI = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    type: TaskType.CODING,
    difficulty: TaskDifficulty.BEGINNER,
    content: {
      contentType: TaskContentType.CODING,
      prompt: 'Test prompt',
      examples: [],
      constraints: 'Test constraints',
      starterCode: 'console.log("test")',
      testCases: [],
      evaluationCriteria: {
        correctness: [],
        efficiency: [],
        style: [],
      },
    },
    xpReward: 50,
    estimatedDuration: 30,
    skillName: 'JavaScript',
    version: 1,
    icon: TaskIcon.ABC,
    status: TaskStatus.PENDING,
    createdAt: '2024-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title and description', () => {
    const titleElement = fixture.nativeElement.querySelector('.title');
    const descriptionElement = fixture.nativeElement.querySelector('.description');

    expect(titleElement.textContent).toBe('Test Task');
    expect(descriptionElement.textContent).toBe('Test Description');
  });

  it('should display XP and time tags', () => {
    const xpTag = fixture.nativeElement.querySelector('.tag-xp');
    const timeTag = fixture.nativeElement.querySelector('.tag-time');

    expect(xpTag.textContent).toBe('+50 XP');
    expect(timeTag.textContent).toBe('30 min');
  });

  it('should display formatted skill and difficulty', () => {
    const skillElement = fixture.nativeElement.querySelector('.detail-item:first-child');
    const difficultyElement = fixture.nativeElement.querySelector('.detail-item:last-child');

    expect(skillElement.textContent).toBe('JavaScript');
    expect(difficultyElement.textContent).toBe('Beginner');
  });

  it('should show start button for pending tasks', () => {
    const startButton = fixture.nativeElement.querySelector('.start-button');
    const statusCompleted = fixture.nativeElement.querySelector('.status-completed');

    expect(startButton).toBeTruthy();
    expect(statusCompleted).toBeFalsy();
  });

  it('should show completed status for completed tasks', () => {
    const completedTask = { ...mockTask, status: TaskStatus.COMPLETED };
    fixture.componentRef.setInput('task', completedTask);
    fixture.componentRef.setInput('isCompleted', true);
    fixture.detectChanges();

    const startButton = fixture.nativeElement.querySelector('.start-button');
    const statusCompleted = fixture.nativeElement.querySelector('.status-completed');

    expect(startButton).toBeFalsy();
    expect(statusCompleted).toBeTruthy();
    expect(statusCompleted.textContent).toBe('Completed');
  });

  it('should display correct icon for abc type', () => {
    const iconImg = fixture.nativeElement.querySelector('.icon-image');

    expect(iconImg).toBeTruthy();
    expect(iconImg.src).toContain('abc.png');
  });

  it('should display correct icon for pencil type', () => {
    const pencilTask = { ...mockTask, icon: TaskIcon.PENCIL };
    fixture.componentRef.setInput('task', pencilTask);
    fixture.detectChanges();

    const iconImg = fixture.nativeElement.querySelector('.icon-image');

    expect(iconImg).toBeTruthy();
    expect(iconImg.src).toContain('pencil.png');
  });

  it('should call onStartTask when start button is clicked', () => {
    jest.spyOn(component, 'onStartTask');

    const startButton = fixture.nativeElement.querySelector('.start-button');
    startButton.click();

    expect(component.onStartTask).toHaveBeenCalled();
  });

  it('should not show XP tag when xp is 0', () => {
    const noXpTask = { ...mockTask, xpReward: 0 };
    fixture.componentRef.setInput('task', noXpTask);
    fixture.detectChanges();

    const xpTag = fixture.nativeElement.querySelector('.tag-xp');

    expect(xpTag).toBeFalsy();
  });

  it('should display divider between skill and difficulty', () => {
    const divider = fixture.nativeElement.querySelector('.divider');

    expect(divider).toBeTruthy();
  });

  it('should emit task id when start task is called', () => {
    jest.spyOn(component.startTask, 'emit');

    component.onStartTask();

    expect(component.startTask.emit).toHaveBeenCalledWith('1');
  });
});

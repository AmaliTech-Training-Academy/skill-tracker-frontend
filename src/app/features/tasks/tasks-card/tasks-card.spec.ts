import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TasksCard } from './tasks-card';

describe('TasksCard', () => {
  let component: TasksCard;
  let fixture: ComponentFixture<TasksCard>;

  const mockTask = {
    icon: 'abc',
    title: 'Test Task',
    description: 'Test Description',
    xp: 50,
    time: '30 min',
    skill: 'JavaScript',
    difficulty: 'Easy',
    status: 'Pending',
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

  it('should display skill and difficulty', () => {
    const skillElement = fixture.nativeElement.querySelector('.detail-item:first-child');
    const difficultyElement = fixture.nativeElement.querySelector('.detail-item:last-child');

    expect(skillElement.textContent).toBe('JavaScript');
    expect(difficultyElement.textContent).toBe('Easy');
  });

  it('should show start button for pending tasks', () => {
    const startButton = fixture.nativeElement.querySelector('.start-button');
    const statusCompleted = fixture.nativeElement.querySelector('.status-completed');

    expect(startButton).toBeTruthy();
    expect(statusCompleted).toBeFalsy();
  });

  it('should show completed status for completed tasks', () => {
    fixture.componentRef.setInput('task', { ...mockTask, status: 'Completed' });
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
    fixture.componentRef.setInput('task', { ...mockTask, icon: 'pencil' });
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
    fixture.componentRef.setInput('task', { ...mockTask, xp: 0 });
    fixture.detectChanges();

    const xpTag = fixture.nativeElement.querySelector('.tag-xp');

    expect(xpTag).toBeFalsy();
  });

  it('should display divider between skill and difficulty', () => {
    const divider = fixture.nativeElement.querySelector('.divider');

    expect(divider).toBeTruthy();
  });
});

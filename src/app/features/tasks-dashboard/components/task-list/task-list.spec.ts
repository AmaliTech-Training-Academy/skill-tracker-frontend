import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TaskList } from './task-list';
import { Task, TaskIcon, TaskDifficulty, TaskStatus } from '@app/core/models/tasks-model';
import { selectTimeRanges } from '@app/store/tasks/tasks.selectors';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let store: MockStore;

  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Test Task',
      icon: TaskIcon.ABC,
      description: 'Test description',
      skill: 'HTML',
      difficulty: TaskDifficulty.BEGINNER,
      xp: 50,
      time: '15 min',
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTimeRanges, value: ['All Periods', 'Today', 'Yesterday'] }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.componentRef.setInput('todayTasks', mockTasks);
    fixture.componentRef.setInput('previousTasks', mockTasks);
    fixture.componentRef.setInput('selectedTimeRange', 'All Periods');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit timeRangeChanged when onTimeRangeChange is called', () => {
    const emitSpy = jest.spyOn(component.timeRangeChanged, 'emit');
    component.onTimeRangeChange('Today');
    expect(emitSpy).toHaveBeenCalledWith('Today');
  });

  it('should emit startTask when onStartTask is called', () => {
    const emitSpy = jest.spyOn(component.startTask, 'emit');
    component.onStartTask('t1');
    expect(emitSpy).toHaveBeenCalledWith('t1');
  });

  it('should display today tasks section when tasks exist', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.list-title').textContent).toContain("Today's Tasks");
  });

  it('should display previous tasks section when tasks exist', () => {
    const compiled = fixture.nativeElement;
    const listTitles = compiled.querySelectorAll('.list-title');
    expect(listTitles[1].textContent).toContain('Previous Tasks');
  });
});

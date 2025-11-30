import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskList } from './task-list';
import { selectTimeRanges } from '@app/store/tasks/tasks.selectors';
import {
  TaskUI,
  TaskDifficulty,
  TaskIcon,
  TaskStatus,
  TaskType,
  TaskContentType,
  PagedResponse,
} from '@app/core/models/tasks-model';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let store: MockStore;

  const mockTasks: TaskUI[] = [
    {
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
        starterCode: 'test code',
        testCases: [],
        evaluationCriteria: { correctness: [], efficiency: [], style: [] },
      },
      xpReward: 50,
      estimatedDuration: 15,
      skillName: 'HTML',
      version: 1,
      icon: TaskIcon.ABC,
      status: TaskStatus.PENDING,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockPagination: PagedResponse<TaskUI> = {
    content: mockTasks,
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      sort: { empty: true, sorted: false, unsorted: true },
      offset: 0,
      paged: true,
      unpaged: false,
    },
    last: false,
    totalElements: 10,
    totalPages: 2,
    first: true,
    size: 5,
    number: 0,
    sort: { empty: true, sorted: false, unsorted: true },
    numberOfElements: 1,
    empty: false,
  };

  const mockTimeRanges = ['Today', 'Yesterday', 'Last Week'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectTimeRanges, mockTimeRanges);

    fixture.componentRef.setInput('todayTasks', mockTasks);
    fixture.componentRef.setInput('previousTasks', []);
    fixture.componentRef.setInput('todayTasksPagination', mockPagination);
    fixture.componentRef.setInput('previousTasksPagination', mockPagination);
    fixture.componentRef.setInput('selectedTimeRange', 'Today');
    fixture.componentRef.setInput('loading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit timeRangeChanged when time range changes', () => {
    jest.spyOn(component.timeRangeChanged, 'emit');
    component.onTimeRangeChange('Yesterday');
    expect(component.timeRangeChanged.emit).toHaveBeenCalledWith('Yesterday');
  });

  it('should emit startTask when task is started', () => {
    jest.spyOn(component.startTask, 'emit');
    component.onStartTask('t1');
    expect(component.startTask.emit).toHaveBeenCalledWith('t1');
  });

  it('should emit todayPageChanged when today page changes', () => {
    jest.spyOn(component.todayPageChanged, 'emit');
    component.onTodayPageChange(2);
    expect(component.todayPageChanged.emit).toHaveBeenCalledWith(2);
  });

  it('should emit previousPageChanged when previous page changes', () => {
    jest.spyOn(component.previousPageChanged, 'emit');
    component.onPreviousPageChange(3);
    expect(component.previousPageChanged.emit).toHaveBeenCalledWith(3);
  });

  it('should compute task sections correctly', () => {
    const sections = component.taskSections();
    expect(sections).toHaveLength(2);
    expect(sections[0].title).toBe("Today's Tasks");
    expect(sections[1].title).toBe('Previous Tasks');
    expect(sections[1].showDropdown).toBe(true);
  });

  it('should show loading state when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const sections = component.taskSections();
    expect(sections[0].viewState).toBe('loading');
    expect(sections[1].viewState).toBe('loading');
  });

  it('should show empty state when no tasks', () => {
    fixture.componentRef.setInput('todayTasks', []);
    fixture.componentRef.setInput('previousTasks', []);
    fixture.detectChanges();

    const sections = component.taskSections();
    expect(sections[0].viewState).toBe('empty');
    expect(sections[1].viewState).toBe('empty');
  });
});

jest.mock('@app/core', () => ({
  APP_CONSTANTS: {
    APP_ROUTES: {
      LOGIN: '/login',
    },
  },
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TasksDashboard } from './tasks-dashboard';
import {
  selectFilteredTodayTasks,
  selectSkillFilter,
  selectFilteredPreviousTasks,
  selectTimeRangeFilter,
} from '@app/store/tasks/tasks.selectors';
import {
  TaskUI,
  TaskDifficulty,
  TaskIcon,
  TaskStatus,
  TaskType,
  TaskContentType,
  CompletedPeriod,
} from '@app/core/models/tasks-model';
import {
  loadTasks,
  changeSkillFilter,
  startTask,
  changeTimeRangeFilter,
} from '@app/store/tasks/tasks.actions';

describe('TasksDashboard', () => {
  let component: TasksDashboard;
  let fixture: ComponentFixture<TasksDashboard>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDashboard],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectFilteredTodayTasks, value: mockTasks },
            { selector: selectFilteredPreviousTasks, value: [] },
            { selector: selectSkillFilter, value: 'All' },
            { selector: selectTimeRangeFilter, value: CompletedPeriod.YESTERDAY },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TasksDashboard);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTasks on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
  });

  it('should display tasks from store', () => {
    expect(component.todayTasks()).toEqual(mockTasks);
  });

  it('should display selected skill from store', () => {
    expect(component.selectedSkill()).toBe('All');
  });

  it('should convert CompletedPeriod to string for display', () => {
    expect(component.selectedTimeRangeString).toBe('Yesterday');
  });

  it('should dispatch changeTimeRangeFilter when time range changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onTimeRangeChanged('Today');
    expect(dispatchSpy).toHaveBeenCalledWith(
      changeTimeRangeFilter({ period: CompletedPeriod.TODAY }),
    );
  });

  it('should dispatch changeSkillFilter when skill changes', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onSkillChange('HTML');
    expect(dispatchSpy).toHaveBeenCalledWith(changeSkillFilter({ skill: 'HTML' }));
  });

  it('should dispatch startTask when task is started', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.onStartTask('t1');
    expect(dispatchSpy).toHaveBeenCalledWith(
      startTask({ taskId: 't1', taskType: TaskType.CODING }),
    );
  });
});

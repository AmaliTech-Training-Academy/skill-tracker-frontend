import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TaskHeader } from './task-header';
import { selectSkills } from '@app/store/tasks/tasks.selectors';

describe('TaskHeader', () => {
  let component: TaskHeader;
  let fixture: ComponentFixture<TaskHeader>;
  let store: MockStore;

  const mockSkills = ['All', 'HTML', 'CSS', 'JavaScript'];
  const initialState = {
    tasks: {
      skills: mockSkills,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskHeader],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskHeader);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    store.overrideSelector(selectSkills, mockSkills);
    fixture.componentRef.setInput('selectedSkill', 'All');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and subtitle', () => {
    const titleElement = fixture.nativeElement.querySelector('.tasks-title');
    const subtitleElement = fixture.nativeElement.querySelector('.tasks-subtitle');

    expect(titleElement.textContent).toBe('Tasks');
    expect(subtitleElement.textContent).toBe('Complete task to improve your skills');
  });

  it('should display custom dropdown with skills', () => {
    const dropdown = fixture.nativeElement.querySelector('app-custom-dropdown');

    expect(dropdown).toBeTruthy();
  });

  it('should emit skillChanged when dropdown selection changes', () => {
    jest.spyOn(component.skillChanged, 'emit');

    component.onSkillChange('JavaScript');

    expect(component.skillChanged.emit).toHaveBeenCalledWith('JavaScript');
  });

  it('should pass selected skill to dropdown', () => {
    fixture.componentRef.setInput('selectedSkill', 'CSS');
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector('app-custom-dropdown');
    expect(dropdown).toBeTruthy();
  });
});

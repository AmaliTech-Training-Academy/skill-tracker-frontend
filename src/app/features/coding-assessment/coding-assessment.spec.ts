import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodingAssessment } from './coding-assessment';

describe('CodingAssessment', () => {
  let component: CodingAssessment;
  let fixture: ComponentFixture<CodingAssessment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodingAssessment],
    }).compileComponents();

    fixture = TestBed.createComponent(CodingAssessment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with assessmentStarted as false', () => {
    expect(component.assessmentStarted()).toBe(false);
  });

  it('should have mock task data', () => {
    const task = component.mockTask();
    expect(task.id).toBe('t1');
    expect(task.title).toBe('1. Find the First Unique Character');
    expect(task.estimatedDuration).toBe(15);
  });

  it('should set assessmentStarted to true when onStartTask is called', () => {
    component.onStartTask();
    expect(component.assessmentStarted()).toBe(true);
  });
});

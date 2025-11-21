import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardSkeleton } from './task-card-skeleton';

describe('TaskCardSkeleton', () => {
  let component: TaskCardSkeleton;
  let fixture: ComponentFixture<TaskCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton elements', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.task-card-skeleton')).toBeTruthy();
    expect(compiled.querySelector('.icon-wrapper-skeleton')).toBeTruthy();
    expect(compiled.querySelector('.title-skeleton')).toBeTruthy();
    expect(compiled.querySelector('.description-skeleton')).toBeTruthy();
    expect(compiled.querySelector('.start-button-skeleton')).toBeTruthy();
  });

  it('should have skeleton animation class', () => {
    const compiled = fixture.nativeElement;
    const skeletonElements = compiled.querySelectorAll('.skeleton');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});

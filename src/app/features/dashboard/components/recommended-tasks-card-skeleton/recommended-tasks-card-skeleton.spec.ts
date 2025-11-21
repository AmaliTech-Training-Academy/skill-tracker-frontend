import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedTasksCardSkeleton } from './recommended-tasks-card-skeleton';

describe('RecommendedTasksCardSkeleton', () => {
  let component: RecommendedTasksCardSkeleton;
  let fixture: ComponentFixture<RecommendedTasksCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedTasksCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedTasksCardSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

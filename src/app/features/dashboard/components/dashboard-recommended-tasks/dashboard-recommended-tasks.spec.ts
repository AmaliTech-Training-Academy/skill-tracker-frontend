import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecommendedTasks } from './dashboard-recommended-tasks';

describe('DashboardRecommendedTasks', () => {
  let component: DashboardRecommendedTasks;
  let fixture: ComponentFixture<DashboardRecommendedTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRecommendedTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecommendedTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

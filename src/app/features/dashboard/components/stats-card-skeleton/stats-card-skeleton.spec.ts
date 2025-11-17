import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardSkeleton } from './stats-card-skeleton';

describe('StatsCardSkeleton', () => {
  let component: StatsCardSkeleton;
  let fixture: ComponentFixture<StatsCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

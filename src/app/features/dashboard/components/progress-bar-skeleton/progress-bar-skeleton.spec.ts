import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarSkeleton } from './progress-bar-skeleton';

describe('ProgressBarSkeleton', () => {
  let component: ProgressBarSkeleton;
  let fixture: ComponentFixture<ProgressBarSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarSkeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

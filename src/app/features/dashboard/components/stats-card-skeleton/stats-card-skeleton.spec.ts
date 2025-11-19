import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
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

  it('should render skeleton cards based on skeletonItems', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skeleton-card'));
    expect(cards.length).toBe(component['skeletonItems']().length);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should display a placeholder for the icon in each card', () => {
    const iconPlaceholders = fixture.debugElement.queryAll(By.css('.skeleton-icon'));
    expect(iconPlaceholders.length).toBe(component['skeletonItems']().length);
  });

  it('should display placeholders for two lines of text in each card', () => {
    const textPlaceholders = fixture.debugElement.queryAll(By.css('.skeleton-text'));
    expect(textPlaceholders.length).toBe(component['skeletonItems']().length * 2);

    const titlePlaceholders = fixture.debugElement.queryAll(By.css('.skeleton-title'));
    expect(titlePlaceholders.length).toBe(component['skeletonItems']().length);
  });
});

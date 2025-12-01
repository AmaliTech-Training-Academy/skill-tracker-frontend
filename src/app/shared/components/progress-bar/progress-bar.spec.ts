import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';

import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  let component: ProgressBar;
  let fixture: ComponentFixture<ProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBar);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render default values correctly', () => {
    fixture.detectChanges();

    expect(component.progressPercent()).toBe(0);
    expect(component.xpNeeded()).toBe(100);

    const titleEl = fixture.debugElement.query(By.css('.progress-title')).nativeElement;
    const ratioEl = fixture.debugElement.query(By.css('.progress-ratio')).nativeElement;
    const footerEl = fixture.debugElement.query(By.css('.progress-footer span')).nativeElement;
    const fillEl = fixture.debugElement.query(By.css('.progress-bar-fill')).nativeElement;

    expect(titleEl.textContent).toContain('Progress to Next Level');
    expect(ratioEl.textContent).toContain('0XP / 100XP');
    expect(footerEl.textContent).toContain('100 XP needed');
    expect(fillEl.style.width).toBe('0%');
  });

  it('should calculate and render 50% progress', () => {
    component.currentXp = 50;
    component.totalXp = 100;
    component.levelName = 'Level 5';
    fixture.detectChanges();

    expect(component.progressPercent()).toBe(33.33333333333333);
    expect(component.xpNeeded()).toBe(100);

    const titleEl = fixture.debugElement.query(By.css('.progress-title')).nativeElement;
    const ratioEl = fixture.debugElement.query(By.css('.progress-ratio')).nativeElement;
    const footerEl = fixture.debugElement.query(By.css('.progress-footer span')).nativeElement;
    const fillEl = fixture.debugElement.query(By.css('.progress-bar-fill')).nativeElement;

    expect(titleEl.textContent).toContain('Progress to Level 5');
    expect(ratioEl.textContent).toContain('50XP / 150XP');
    expect(footerEl.textContent).toContain('100 XP needed to proceed to the next level');
    expect(fillEl.style.width).toBe('33.33333333333333%');
  });

  it('should handle large numbers and format them with commas', () => {
    component.currentXp = 1250;
    component.totalXp = 5000;
    fixture.detectChanges();

    expect(component.progressPercent()).toBe(20);
    expect(component.xpNeeded()).toBe(5000);

    const ratioEl = fixture.debugElement.query(By.css('.progress-ratio')).nativeElement;
    const footerEl = fixture.debugElement.query(By.css('.progress-footer span')).nativeElement;
    const fillEl = fixture.debugElement.query(By.css('.progress-bar-fill')).nativeElement;

    expect(ratioEl.textContent).toContain('1,250XP / 6,250XP');
    expect(footerEl.textContent).toContain('5,000 XP needed to proceed to the next level');
    expect(fillEl.style.width).toBe('20%');
  });

  it('should handle division by zero safely', () => {
    component.currentXp = 0;
    component.totalXp = 0;
    fixture.detectChanges();

    expect(component.progressPercent()).toBe(0);
    expect(component.xpNeeded()).toBe(0);

    const ratioEl = fixture.debugElement.query(By.css('.progress-ratio')).nativeElement;
    const fillEl = fixture.debugElement.query(By.css('.progress-bar-fill')).nativeElement;

    expect(ratioEl.textContent).toContain('0XP / 0XP');
    expect(fillEl.style.width).toBe('0%');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComplete } from './task-complete';

describe('TaskComplete', () => {
  let component: TaskComplete;
  let fixture: ComponentFixture<TaskComplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComplete],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComplete);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('xpEarned', 50);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct XP earned', () => {
    expect(component.xpEarned()).toBe(50);
    const xpElement = fixture.nativeElement.querySelector('.xp-reward');
    expect(xpElement.textContent).toBe('+50 XP');
  });

  it('should display default title', () => {
    const titleElement = fixture.nativeElement.querySelector('.modal-title');
    expect(titleElement.textContent).toBe('Task Complete!');
  });

  it('should emit continue when continue button is clicked', () => {
    jest.spyOn(component.continue, 'emit');
    const button = fixture.nativeElement.querySelector('.continue-button');
    button.click();
    expect(component.continue.emit).toHaveBeenCalled();
  });

  it('should show secondary button when enabled', () => {
    fixture.componentRef.setInput('showSecondaryButton', true);
    fixture.detectChanges();

    const secondaryButton = fixture.nativeElement.querySelector('.secondary-button');
    expect(secondaryButton).toBeTruthy();
  });

  it('should not display XP when xpEarned is 0', () => {
    fixture.componentRef.setInput('xpEarned', 0);
    fixture.detectChanges();

    const xpElement = fixture.nativeElement.querySelector('.xp-reward');
    expect(xpElement).toBeFalsy();
  });
});

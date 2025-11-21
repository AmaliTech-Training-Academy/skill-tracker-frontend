import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFailure } from './task-failure';

describe('TaskFailure', () => {
  let component: TaskFailure;
  let fixture: ComponentFixture<TaskFailure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFailure],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFailure);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('errorMessage', 'Test error message');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    expect(component.errorMessage()).toBe('Test error message');
  });

  it('should emit tryAgain when try again button is clicked', () => {
    component.tryAgain.emit = jest.fn();
    const button = fixture.nativeElement.querySelector('.try-again-button');
    button.click();
    expect(component.tryAgain.emit).toHaveBeenCalled();
  });

  it('should emit backToDashboard when dashboard button is clicked', () => {
    component.backToDashboard.emit = jest.fn();
    const button = fixture.nativeElement.querySelector('.dashboard-button');
    button.click();
    expect(component.backToDashboard.emit).toHaveBeenCalled();
  });
});

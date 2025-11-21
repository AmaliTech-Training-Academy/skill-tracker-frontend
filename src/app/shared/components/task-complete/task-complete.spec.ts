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
});

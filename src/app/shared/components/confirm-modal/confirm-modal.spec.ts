import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmSubmit when onConfirm is called', () => {
    component.confirmSubmit.emit = jest.fn();
    component.onConfirm();
    expect(component.confirmSubmit.emit).toHaveBeenCalled();
  });

  it('should emit cancelSubmit when onCancel is called', () => {
    component.cancelSubmit.emit = jest.fn();
    component.onCancel();
    expect(component.cancelSubmit.emit).toHaveBeenCalled();
  });
});

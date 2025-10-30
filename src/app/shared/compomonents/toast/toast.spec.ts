import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '@app/core';
import { ToastType } from '@app/core';
import { Toast } from './toast';
import { of } from 'rxjs';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let mockToastService: jest.Mocked<Pick<ToastService, 'config$' | 'isVisible$' | 'isExiting$' | 'close'>>;

  beforeEach(async () => {
    mockToastService = {
      config$: of({ type: ToastType.SUCCESS, title: 'Test', message: 'Test message' }),
      isVisible$: of(true),
      isExiting$: of(false),
      close: jest.fn()
    } as jest.Mocked<Pick<ToastService, 'config$' | 'isVisible$' | 'isExiting$' | 'close'>>;

    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose toast type enum', () => {
    expect(component.toastType).toBe(ToastType);
  });

  it('should expose service observables', () => {
    expect(component.config$).toBe(mockToastService.config$);
    expect(component.show$).toBe(mockToastService.isVisible$);
    expect(component.exiting$).toBe(mockToastService.isExiting$);
  });

  it('should call toast service close when onClose is called', () => {
    component.onClose();
    
    expect(mockToastService.close).toHaveBeenCalled();
  });
});
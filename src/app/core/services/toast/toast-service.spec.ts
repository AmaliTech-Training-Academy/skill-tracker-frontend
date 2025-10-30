import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ToastService } from './toast-service';
import { ToastType } from '../../models/toast-model';
import { showToast, startToastExit } from '@app/store';

describe('ToastService', () => {
  let service: ToastService;
  let mockStore: jest.Mocked<Pick<Store, 'dispatch' | 'select'>>;

  beforeEach(() => {
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn()
    } as jest.Mocked<Pick<Store, 'dispatch' | 'select'>>;

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch showToast action when show is called', () => {
    const config = { type: ToastType.SUCCESS, title: 'Test', message: 'Test message' };
    
    service.show(config);
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(showToast({ config }));
  });

  it('should show success toast', () => {
    service.showSuccess('Success', 'Success message');
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(showToast({
      config: { type: ToastType.SUCCESS, title: 'Success', message: 'Success message' }
    }));
  });

  it('should show error toast', () => {
    service.showError('Error', 'Error message');
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(showToast({
      config: { type: ToastType.ERROR, title: 'Error', message: 'Error message' }
    }));
  });

  it('should show info toast', () => {
    service.showInfo('Info', 'Info message');
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(showToast({
      config: { type: ToastType.INFO, title: 'Info', message: 'Info message' }
    }));
  });

  it('should show warning toast', () => {
    service.showWarning('Warning', 'Warning message');
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(showToast({
      config: { type: ToastType.WARNING, title: 'Warning', message: 'Warning message' }
    }));
  });

  it('should dispatch startToastExit action when close is called', () => {
    service.close();
    
    expect(mockStore.dispatch).toHaveBeenCalledWith(startToastExit());
  });
});
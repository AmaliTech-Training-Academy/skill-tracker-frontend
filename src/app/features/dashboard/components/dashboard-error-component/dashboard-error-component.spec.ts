import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DashboardErrorComponent } from './dashboard-error-component';
import { AppIcon } from '@app/shared/components/app-icon/app-icon';

@Component({
  selector: 'app-icon',
  template: '',
  standalone: true,
})
class MockAppIconComponent {}

describe('DashboardErrorComponent', () => {
  let component: DashboardErrorComponent;
  let fixture: ComponentFixture<DashboardErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardErrorComponent, MockAppIconComponent],
    })
      .overrideComponent(DashboardErrorComponent, {
        remove: { imports: [AppIcon] },
        add: { imports: [MockAppIconComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and message when no inputs are provided', () => {
    const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement;
    const messageEl = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titleEl.textContent).toContain('An Error Occurred');
    expect(messageEl.textContent).toContain('Please try again later');
  });

  it('should display custom title and message when inputs are provided', () => {
    const customTitle = 'An Error Occurred';
    const customMessage = 'Please try again later';

    component.title = customTitle;
    component.message = customMessage;
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement;
    const messageEl = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titleEl.textContent).toContain(customTitle);
    expect(messageEl.textContent).toContain(customMessage);
  });

  it('should emit retry event when the retry button is clicked', () => {
    jest.spyOn(component.retry, 'emit');

    const retryButton = fixture.debugElement.query(By.css('button')).nativeElement;
    retryButton.click();

    expect(component.retry.emit).toHaveBeenCalledTimes(1);
  });

  it('should call onRetryClick when the retry button is clicked', () => {
    jest.spyOn(component, 'onRetryClick');

    const retryButton = fixture.debugElement.query(By.css('button')).nativeElement;
    retryButton.click();

    expect(component.onRetryClick).toHaveBeenCalledTimes(1);
  });
});

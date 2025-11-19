import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DashboardHeaderComponent } from './dashboard-header-component';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the welcome message with the provided username', () => {
    const testUsername = 'Victor';
    component.username = testUsername;
    fixture.detectChanges();

    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1.textContent).toContain(`Welcome ${testUsername} 👋`);
  });

  it('should have the correct welcomeMessage when username is set', () => {
    const testUsername = 'Aba';
    component.username = testUsername;
    expect(component.welcomeMessage).toBe(`Welcome ${testUsername} 👋`);
  });

  it('should handle an empty username in the welcome message', () => {
    component.username = '';
    expect(component.welcomeMessage).toBe('Welcome  👋');
  });
});

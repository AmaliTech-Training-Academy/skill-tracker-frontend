import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons, TourGuide } from '@app/core';
import { initialAuthState } from '@app/store/auth/auth.state';

import { Dashboard } from './dashboard';
import { DashboardNavigation, DashboardSidebar } from '@app/shared';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let store: MockStore;

  const mockAuthState = {
    ...initialAuthState,
    user: {
      ...initialAuthState.user,
      tourStatus: TourGuide.IN_PROGRESS,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: { auth: mockAuthState },
        }),
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the isSidebarOpen signal set to false on initialization', () => {
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should toggle the isSidebarOpen signal value on each call to toggleSidebar', () => {
    expect(component.isSidebarOpen()).toBe(false);

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(true);

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should toggle the sidebar when the toggleSidebar event is emitted from the navigation component', () => {
    expect(component.isSidebarOpen()).toBe(false);

    const navDebugElement = fixture.debugElement.query(By.directive(DashboardNavigation));

    navDebugElement.triggerEventHandler('toggleSidebar', null);
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(true);
  });

  it('should set isSidebarOpen to false when onNavigate is called', () => {
    component.isSidebarOpen.set(true);
    fixture.detectChanges();
    expect(component.isSidebarOpen()).toBe(true);

    component.onNavigate();

    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should close the sidebar when the sidebar component emits a navigated event', () => {
    component.isSidebarOpen.set(true);

    const sidebarDebugElement = fixture.debugElement.query(By.directive(DashboardSidebar));
    sidebarDebugElement.triggerEventHandler('navigated', null);
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should close the sidebar when the overlay is clicked', () => {
    component.isSidebarOpen.set(true);
    fixture.detectChanges();

    const overlayButton = fixture.debugElement.query(By.css('.sidebar-overlay'));
    overlayButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(false);
  });
});

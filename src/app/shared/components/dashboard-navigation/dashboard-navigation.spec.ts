import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { provideMockStore } from '@ngrx/store/testing';
import { appIcons } from '@app/core';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';
import { selectTotalUserXp } from '@app/store/tasks';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLink } from '@angular/router';

import { DashboardNavigation } from './dashboard-navigation';

describe('DashboardNavigation', () => {
  let component: DashboardNavigation;
  let fixture: ComponentFixture<DashboardNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNavigation, RouterTestingModule],
      providers: [
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
        provideMockStore({
          selectors: [
            { selector: selectCurrentUser, value: { username: 'Test User' } },
            { selector: selectTotalUserXp, value: 100 },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNavigation);
    component = fixture.componentInstance;
    component.isSidebarOpen = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select current user from the store', () => {
    expect(component.user()?.username).toBe('Test User');
  });

  it('should select totalUserxp from the store', () => {
    expect(component.totalUserxp()).toBe(100);
  });

  it('should emit toggleSidebar event when onToggleSidebar is called', () => {
    jest.spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();

    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  it('should call onToggleSidebar when the menu button is clicked (if present)', () => {
    const onToggleSpy = jest.spyOn(component, 'onToggleSidebar');

    const menuButton = fixture.debugElement.query(By.css('.menu-button'));
    expect(menuButton).toBeTruthy();

    menuButton.triggerEventHandler('click', null);
    expect(onToggleSpy).toHaveBeenCalled();
  });

  it('should render router links in the template (if any)', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).toBeGreaterThan(0);
  });
});

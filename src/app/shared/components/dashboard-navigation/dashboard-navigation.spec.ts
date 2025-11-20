import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { provideMockStore } from '@ngrx/store/testing';
import { appIcons } from '@app/core';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';

import { DashboardNavigation } from './dashboard-navigation';

describe('DashboardNavigation', () => {
  let component: DashboardNavigation;
  let fixture: ComponentFixture<DashboardNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNavigation],
      providers: [
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
        provideMockStore({
          selectors: [{ selector: selectCurrentUser, value: { username: 'Test User' } }],
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

  it('should emit toggleSidebar event when onToggleSidebar is called', () => {
    jest.spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();

    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });

  it('should call onToggleSidebar when the menu button is clicked', () => {
    const onToggleSpy = jest.spyOn(component, 'onToggleSidebar');

    const menuButton = fixture.debugElement.query(By.css('.menu-button'));

    if (menuButton) {
      menuButton.triggerEventHandler('click', null);
      expect(onToggleSpy).toHaveBeenCalled();
    }
  });
});

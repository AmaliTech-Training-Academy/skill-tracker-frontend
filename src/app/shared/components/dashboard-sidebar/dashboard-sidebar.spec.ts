import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons } from '@app/core';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { selectIsLoggingOut } from '@app/store/auth/auth.selectors';
import { logout } from '@app/store/auth/auth.actions';
import { DashboardSidebar } from './dashboard-sidebar';

describe('DashboardSidebar', () => {
  let component: DashboardSidebar;
  let fixture: ComponentFixture<DashboardSidebar>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebar, RouterLinkActive],
      providers: [
        provideRouter([]),
        importProvidersFrom(LucideAngularModule.pick(appIcons)),
        provideMockStore({
          selectors: [{ selector: selectIsLoggingOut, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidebar);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    component.isOpen = false;
    component.menuItems = [];
    component.footerItems = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit navigated event when onNavigate is called', () => {
    jest.spyOn(component.navigated, 'emit');

    component.onNavigate();

    expect(component.navigated.emit).toHaveBeenCalled();
  });

  it('should dispatch logout action when logout is called and not submitting', () => {
    jest.spyOn(store, 'dispatch');
    component.logout();
    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });

  it('should not dispatch logout action when logout is called and is submitting', () => {
    store.overrideSelector(selectIsLoggingOut, true);
    fixture.detectChanges();

    jest.spyOn(store, 'dispatch');
    component.logout();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});

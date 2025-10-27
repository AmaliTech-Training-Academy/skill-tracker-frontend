import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { provideRouter, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { appIcons } from '@app/core';

import { DashboardSidebar } from './dashboard-sidebar';

describe('DashboardSidebar', () => {
  let component: DashboardSidebar;
  let fixture: ComponentFixture<DashboardSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebar, RouterLinkActive],
      providers: [provideRouter([]), importProvidersFrom(LucideAngularModule.pick(appIcons))],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSidebar);
    component = fixture.componentInstance;

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
});

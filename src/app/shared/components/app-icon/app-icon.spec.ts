import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, User, Settings } from 'lucide-angular';
import { AppIcon } from './app-icon';

describe('AppIcon', () => {
  let component: AppIcon;
  let fixture: ComponentFixture<AppIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppIcon],
      providers: [
        importProvidersFrom(
          LucideAngularModule.pick({
            Home,
            User,
            Settings,
          }),
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppIcon);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.name = 'home';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the real <lucide-icon> component', () => {
    component.name = 'home';
    fixture.detectChanges();

    const lucideIconElement = fixture.debugElement.query(By.css('lucide-icon'));
    expect(lucideIconElement).not.toBeNull();
  });
});

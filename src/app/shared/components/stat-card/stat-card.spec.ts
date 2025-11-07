import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Flame, ClipboardCheck, BrainCircuit } from 'lucide-angular';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  let component: StatCard;
  let fixture: ComponentFixture<StatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
      providers: [
        importProvidersFrom(
          LucideAngularModule.pick({
            Flame,
            ClipboardCheck,
            BrainCircuit,
          }),
        ),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCard);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the title and value correctly', () => {
    component.title = 'Current Streak';
    component.value = '5 days';
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('.stat-card-title')).nativeElement;
    const valueEl = fixture.debugElement.query(By.css('.stat-card-value')).nativeElement;

    expect(titleEl.textContent).toContain('Current Streak');
    expect(valueEl.textContent).toContain('5 days');
  });

  it('should not render lucide-icon if iconName is not provided', () => {
    component.iconName = '';
    fixture.detectChanges();

    const iconDebugEl = fixture.debugElement.query(By.css('lucide-icon'));
    expect(iconDebugEl).toBeNull();
  });

  it('should render lucide-icon when iconName is provided', () => {
    component.iconName = 'flame';
    fixture.detectChanges();

    const iconDebugEl = fixture.debugElement.query(By.css('lucide-icon'));
    expect(iconDebugEl).not.toBeNull();
  });
});

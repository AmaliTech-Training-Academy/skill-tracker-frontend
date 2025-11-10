import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { SkillLevelSelectorComponent } from './skill-level-selector';

describe('SkillLevelSelectorComponent', () => {
  let component: SkillLevelSelectorComponent;
  let fixture: ComponentFixture<SkillLevelSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillLevelSelectorComponent],
    })
      .overrideComponent(SkillLevelSelectorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SkillLevelSelectorComponent);
    component = fixture.componentInstance;

    component.skillName = 'Test Skill';

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the skillName input', () => {
    const nameEl = fixture.nativeElement.querySelector('.skill-name');
    expect(nameEl.textContent).toContain('Test Skill');
  });

  it('should set the img src and alt attributes correctly', () => {
    let iconEl: HTMLImageElement = fixture.nativeElement.querySelector('.skill-icon');
    expect(iconEl).not.toBeNull();

    expect(iconEl.src).not.toContain('assets/test-icon.png');
    expect(iconEl.alt).toBe('Test Skill');

    component.skillIcon = 'assets/test-icon.png';
    fixture.detectChanges();

    iconEl = fixture.nativeElement.querySelector('.skill-icon');
    expect(iconEl.src).toContain('assets/test-icon.png');
  });

  it('should render the default levels', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.level-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('Beginner');
    expect(buttons[1].textContent).toContain('Intermediate');
    expect(buttons[2].textContent).toContain('Advanced');
  });

  it('should apply the correct "selected" class based on selectedLevel input', () => {
    component.selectedLevel = 'INTERMEDIATE';
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.level-btn'));

    expect(buttons[0].nativeElement.classList.contains('selected')).toBe(false);
    expect(buttons[1].nativeElement.classList.contains('selected')).toBe(true);
    expect(buttons[2].nativeElement.classList.contains('selected')).toBe(false);
  });

  it('should emit the correct level when a button is clicked', () => {
    jest.spyOn(component.levelSelected, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('.level-btn'));

    buttons[2].nativeElement.click();

    expect(component.levelSelected.emit).toHaveBeenCalledWith('ADVANCED');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestsSelection } from './interests-selection';
import { SkillsService } from './interests.service';
import { InterestsChipComponent } from '@app/shared/components/interests-chip/interests-chip';
import { ChangeDetectionStrategy } from '@angular/core';


const mockSkills = [
  { id: 'python', label: 'Python', icon: 'assets/python-icon.png' },
  { id: 'javascript', label: 'JavaScript', icon: 'assets/js-icon.png' },
];


class MockSkillsService {
  getSkills() {
    return mockSkills;
  }
}

describe('InterestsSelection', () => {
  let component: InterestsSelection;
  let fixture: ComponentFixture<InterestsSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestsChipComponent, InterestsSelection],
      providers: [{ provide: SkillsService, useClass: MockSkillsService }],
    })
      .overrideComponent(InterestsSelection, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InterestsSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should load skills from SkillsService on init', () => {
    expect(component.badges.length).toBe(mockSkills.length);
    expect(component.badges[0].id).toBe('python');
  });

  
  it('should render skill chips for each skill', () => {
    const chipElements = fixture.nativeElement.querySelectorAll('app-interests-chip');
    expect(chipElements.length).toBe(mockSkills.length);
  });

  
  it('should add a skill when toggleBadge is called', () => {
    component.toggleBadge('python');
    expect(component.selectedBadges).toContain('python');
  });

 
  it('should remove a skill when toggled again', () => {
    component.toggleBadge('python');
    component.toggleBadge('python'); 
    expect(component.selectedBadges).not.toContain('python');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsDevelopment } from './skills-development';
import { FeatureSection } from '@app/shared/compomonents/feature-section/feature-section';

describe('SkillsDevelopment', () => {
  let component: SkillsDevelopment;
  let fixture: ComponentFixture<SkillsDevelopment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsDevelopment, FeatureSection],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsDevelopment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title and subtitle', () => {
    expect(component.title).toBe('Skills Development');
    expect(component.subtitle).toBe('Master the essential skills for your success.');
  });

  it('should have 4 skills', () => {
    expect(component.skills).toHaveLength(4);
  });

  it('should have correct skills data', () => {
    const expectedSkills = [
      'Technical Mastery',
      'Problem Solving',
      'Goal Setting',
      'Quick Learning',
    ];

    component.skills.forEach((skill, index) => {
      expect(skill.title).toBe(expectedSkills[index]);
      expect(skill.description).toBeTruthy();
      expect(skill.icon).toContain('assets/');
    });
  });
});

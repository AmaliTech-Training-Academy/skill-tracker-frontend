import { TestBed } from '@angular/core/testing';

import { OnboardingDataService } from './onboarding-data-service';
import { SkillLevel } from '@app/core/models/auth.model';

describe('OnboardingDataService', () => {
  let service: OnboardingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with an empty skills array', () => {
    expect(service.skills()).toEqual([]);
  });

  describe('setInterests', () => {
    it('should set skills with null levels from an array of IDs', () => {
      const skillIds = ['skill1', 'skill2'];
      service.setInterests(skillIds);

      const expectedSkills = [
        { skillId: 'skill1', level: null },
        { skillId: 'skill2', level: null },
      ];
      expect(service.skills()).toEqual(expectedSkills);
    });

    it('should overwrite existing skills', () => {
      service.setInterests(['initialSkill']);
      service.setInterests(['newSkill1', 'newSkill2']);

      const expectedSkills = [
        { skillId: 'newSkill1', level: null },
        { skillId: 'newSkill2', level: null },
      ];
      expect(service.skills()).toEqual(expectedSkills);
    });
  });

  describe('updateSkillLevel', () => {
    beforeEach(() => {
      service.setInterests(['skill1', 'skill2']);
    });

    it('should update the level of a specific skill', () => {
      service.updateSkillLevel('skill1', 'Beginner');

      const skill = service.skills().find((s) => s.skillId === 'skill1');
      expect(skill?.level).toBe('Beginner');
    });

    it('should not affect other skills when updating one', () => {
      service.updateSkillLevel('skill1', 'Intermediate');

      const otherSkill = service.skills().find((s) => s.skillId === 'skill2');
      expect(otherSkill?.level).toBeNull();
    });

    it('should not change the state if the skillId does not exist', () => {
      const initialSkills = service.skills();
      service.updateSkillLevel('non-existent-skill', 'Advanced');
      expect(service.skills()).toEqual(initialSkills);
    });
  });

  describe('getPayload', () => {
    beforeEach(() => {
      service.setInterests(['skill1', 'skill2', 'skill3']);
      service.updateSkillLevel('skill1', 'Beginner');
      service.updateSkillLevel('skill3', 'Advanced');
    });

    it('should return an empty skills array if skipped is true', () => {
      const payload = service.getPayload(true);
      expect(payload).toEqual({ skills: [] });
    });

    it('should return only skills with non-null levels if not skipped', () => {
      const payload = service.getPayload();
      const expectedSkills = [
        { skillId: 'skill1', level: 'Beginner' },
        { skillId: 'skill3', level: 'Advanced' },
      ];
      expect(payload.skills).toEqual(expect.arrayContaining(expectedSkills));
      expect(payload.skills.length).toBe(2);
    });
  });

  describe('reset', () => {
    it('should clear all skills from the state', () => {
      service.setInterests(['skill1', 'skill2']);
      service.updateSkillLevel('skill1', 'Beginner');

      expect(service.skills().length).toBe(2);

      service.reset();

      expect(service.skills()).toEqual([]);
    });
  });
});

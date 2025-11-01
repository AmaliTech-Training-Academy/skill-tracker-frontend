import { Injectable, signal, WritableSignal } from '@angular/core';
import { CompleteOnboardingRequest, UserSkill, SkillLevel } from '@app/core/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingDataService {
  private skills$: WritableSignal<UserSkill[]> = signal([]);

  public skills = this.skills$.asReadonly();

  public setInterests(skillIds: string[]): void {
    const newSkills: UserSkill[] = skillIds.map((id) => ({
      skillId: id,
      level: null,
    }));
    this.skills$.set(newSkills);
  }

  public updateSkillLevel(skillId: string, level: SkillLevel): void {
    this.skills$.update((currentSkills) => {
      return currentSkills.map((skill) =>
        skill.skillId === skillId ? { ...skill, level } : skill,
      );
    });
  }

  public getPayload(skipped = false): CompleteOnboardingRequest {
    if (skipped) {
      return { skills: [] };
    }

    const completedSkills = this.skills().filter(
      (skill): skill is UserSkill & { level: SkillLevel } => skill.level !== null,
    );
    return { skills: completedSkills };
  }

  public reset(): void {
    this.skills$.set([]);
  }
}

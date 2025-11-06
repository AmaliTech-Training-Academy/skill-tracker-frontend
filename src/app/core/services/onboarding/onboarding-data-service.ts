import { Injectable, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CompleteOnboardingRequest,
  UserSkill,
  SkillLevel,
  UserEmailRequest,
} from '@app/core/models/auth.model';
import { selectCurrentUser } from '@app/store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class OnboardingDataService {
  private skills$: WritableSignal<UserSkill[]> = signal([]);
  public skills = this.skills$.asReadonly();

  constructor(private store: Store) {}

  public currentUser = this.store.selectSignal(selectCurrentUser);

  public setInterests(skillIds: string[]): void {
    const newSkills: UserSkill[] = skillIds.map((id) => ({
      skillId: id,
      level: null,
    }));
    this.skills$.set(newSkills);
  }

  public updateSkillLevel(skillId: string, level: SkillLevel | null): void {
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

  public getUserStatePayLoad(skipped = false): UserEmailRequest {
    const email = this.currentUser()?.email ?? '';
    return { email };
  }

  public reset(): void {
    this.skills$.set([]);
  }
}

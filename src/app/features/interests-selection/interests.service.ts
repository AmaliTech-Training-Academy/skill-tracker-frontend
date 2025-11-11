import { Injectable } from '@angular/core';

export interface Skill {
  id: string;
  label: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  // TODO: THIS WILL BE TAKEN OUT ONCE INTEGRATION IS DONE
  private skills: Skill[] = [
    { id: 'c162d002-f5af-4d99-94e3-192e08279b81', label: 'JavaScript', icon: 'assets/js-icon.png' },
  ];

  public getSkills(): Skill[] {
    return this.skills;
  }
}

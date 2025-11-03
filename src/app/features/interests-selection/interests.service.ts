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
  private skills: Skill[] = [
    { id: 'python', label: 'Python', icon: 'assets/python-icon.png' },
    { id: 'javascript', label: 'JavaScript', icon: 'assets/js-icon.png' },
    { id: 'csharp', label: 'C#', icon: 'assets/csharp-icon.png' },
    { id: 'cloudbasis', label: 'CloudBasis', icon: 'assets/cloudbasis-icon.png' },
    { id: 'sql', label: 'SQL', icon: 'assets/sql-icon.png' },
    { id: 'git-github', label: 'Git & GitHub', icon: 'assets/github-icon.png' },
    { id: 'api', label: 'API', icon: 'assets/api-icon.png' },
    { id: 'debugging', label: 'Debugging', icon: 'assets/debugging-icon.png' },
    { id: 'databases', label: 'Databases', icon: 'assets/htmlcss-icon.png' },
    {
      id: 'android-development',
      label: 'Android Development',
      icon: 'assets/android-development-icon.png',
    },
    {
      id: 'frontend-development',
      label: 'Frontend Development',
      icon: 'assets/frontend-development-icon.png',
    },
    {
      id: 'backend-development',
      label: 'Backend Development',
      icon: 'assets/android-development-icon.png',
    },
    {
      id: 'algorithms-datastructures',
      label: 'Algorithms & Datastructures',
      icon: 'assets/algorithms-datastructures-icon.png',
    },
    {
      id: 'technical-communication',
      label: 'Technical Communication',
      icon: 'assets/technical-communication-icon.png',
    },
    {
      id: 'game-development-basics',
      label: 'Game Development Basics',
      icon: 'assets/game-development-basics-icon.png',
    },
    {
      id: 'fullstack-development',
      label: 'Full Stack Development',
      icon: 'assets/fullstack-development-icon.png',
    },
    {
      id: 'uiux-basics',
      label: 'UI/UX Basics for Developers',
      icon: 'assets/uiux-basics-icon.png',
    },
    { id: 'htmlcss', label: 'HTML & CSS (Web Basics)', icon: 'assets/htmlcss-icon.png' },
  ];

  public getSkills(): Skill[] {
    return this.skills;
  }
}

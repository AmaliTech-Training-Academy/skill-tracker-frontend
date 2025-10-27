import { FeatureSection } from '@app/shared/compomonents/feature-section/feature-section';
import { Feature } from '@app/core/models/feature-card-model';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skills-development',
  imports: [FeatureSection],
  templateUrl: './skills-development.html',
  styleUrl: './skills-development.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsDevelopment {
  public title = 'Skills Development';
  public subtitle = 'Master the essential skills for your success.';
  public skills: Feature[] = [
    {
      title: 'Technical Mastery',
      description: 'Build expertise in programming fundamentals and advanced concepts.',
      icon: 'assets/code.png',
    },
    {
      title: 'Problem Solving',
      description: 'Develop critical thinking and analytical problem-solving abilities.',
      icon: 'assets/bulb.png',
    },
    {
      title: 'Goal Setting',
      description: 'Track progress and achieve personal development milestones.',
      icon: 'assets/timer.png',
    },
    {
      title: 'Quick Learning',
      description: 'Accelerate your learning journey with targeted skill development.',
      icon: 'assets/notebook.png',
    }
  ];
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Feature } from '@app/core/models/feature-card-model';
import { FeatureSection } from '@app/shared/compomonents/feature-section/feature-section';

@Component({
  selector: 'app-features',
  imports: [FeatureSection],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  public title = 'Ready to advance your technical skills?';
  public subtitle =
    "That's where SkillDev comes in. We combine AI-powered practice with personalized feedback to help you master the skills that matter most.";
  public features: Feature[] = [
    {
      title: 'Personalized Learning',
      description: 'AI-tailored practice tasks that adapt to your skill level and learning style.',
      icon: 'assets/target.png',
    },
    {
      title: 'Instant Feedback',
      description: 'Get immediate, detailed feedback on your solutions to improve faster.',
      icon: 'assets/chat.png',
    },
    {
      title: 'Community Driven',
      description: 'Learn alongside peers and compare your progress with others.',
      icon: 'assets/handshake.png',
    },
  ];
}

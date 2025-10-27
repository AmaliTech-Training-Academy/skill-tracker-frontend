import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureCard } from '../feature-card/feature-card';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  imports: [FeatureCard],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
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

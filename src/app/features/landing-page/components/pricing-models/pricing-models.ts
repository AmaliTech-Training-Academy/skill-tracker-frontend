import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PricingCard, PricingPlan } from './pricing-card/pricing-card';

@Component({
  selector: 'app-pricing-models',
  templateUrl: './pricing-models.html',
  styleUrl: './pricing-models.scss',
  imports: [PricingCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingModels {
  public title = 'SkillDev Pricing Models';
  public subtitle = 'Master the essential skills for your success';

  public plans: PricingPlan[] = [
    {
      name: 'Free Plan',
      tagline: 'For new learners exploring the basics',
      price: 0,
      period: '/month',
      isPopular: false,
      features: [
        'Beginner AI-generated challenges',
        'Access to selected public courses',
        'Join learning groups',
        'Track basic progress',
        'Earn badges and milestones',
        'Preview Skill Arena',
      ],
    },
    {
      name: 'Pro',
      tagline: 'For serious learners growing their skills',
      price: 9.99,
      period: '/month',
      isPopular: true,
      features: [
        'Full access to all AI-generated courses',
        'Complete quizzes and tasks in every module',
        'Personalized learning path powered by AI',
        'In-depth skill tracking and analytics',
        'Unlock leaderboard, ranks, and achievements',
      ],
    },
    {
      name: 'Elite',
      tagline: 'Elite Plan',
      price: 19.99,
      period: '/month',
      isPopular: false,
      features: [
        'Everything in Pro, plus:',
        'Advanced AI-adaptive curriculum',
        'Live expert feedback and review sessions',
        'Monthly skill competitions with rewards',
        'Completion certificates for each track',
        'Early access to new Skill Arena game modes',
      ],
    },
  ];
}

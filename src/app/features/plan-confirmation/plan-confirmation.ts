import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  Router,
  RouterLink,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { InputFieldComponent } from '@app/shared';
import { PlanLevels } from '@app/shared/compomonents/plan-levels/plan-levels';
import { getFormControl } from '@app/shared';

export enum Section {
  ChosenPlan = 'chosen-plan',
  PayPage = 'pay-page',
  donePage = 'done-page',
}

interface Plan {
  id: number;
  name: string;
  price: number;
  features: string[];
}

@Component({
  selector: 'app-plan-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputFieldComponent,
    PlanLevels,
  ],
  templateUrl: './plan-confirmation.html',
  styleUrls: ['./plan-confirmation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanConfirmation implements OnDestroy, OnInit {
  Section = Section;
  private destroy$ = new Subject<void>();
  getFormControl = getFormControl;

  currentSection: Section = Section.ChosenPlan;
  selectedPlan: Plan | null = null;
  currentStep = 1;

  paymentForm: FormGroup = new FormBuilder().group({
    cardNumber: ['', [Validators.required, Validators.minLength(16)]],
    fullName: ['', [Validators.required]],
    expiry: ['', [Validators.required]],
    cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
  });

  private plans: Plan[] = [
    {
      id: 1,
      name: 'Free',
      price: 0,
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
      id: 2,
      name: 'Pro',
      price: 9.99,
      features: [
        'Full access to all AI-generated courses',
        'Complete quizzes and tasks in every module',
        'Personalized learning path powered by AI',
        'In-depth skill tracking and analytics',
        'Unlock leaderboard, ranks, and achievements',
      ],
    },
    {
      id: 3,
      name: 'Elite',
      price: 19.0,
      features: [
        'Everything in Pro, plus:',
        'Advanced AI-adaptive curriculum',
        'Live expert feedback and review sessions',
        'Monthly skill competitions with rewards',
        'Completion certificates for each track',
        'Early access to new Skill Arena game modes',
      ],
    },
  ] as const;

  get planName(): string {
    return this.selectedPlan?.name ?? '';
  }

  get features(): string[] {
    return this.selectedPlan?.features ?? [];
  }

  get planPrice(): number {
    return this.selectedPlan?.price ?? 0;
  }

  get chosenPlanSection(): Section {
    return Section.ChosenPlan;
  }

  get payPageSection(): Section {
    return Section.PayPage;
  }

  get donePageSection(): Section {
    return Section.donePage;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadPlanFromRoute();
    this.setupStepTracker();
  }

  private loadPlanFromRoute(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const planId = params.get('plan-id');
      if (planId) {
        const id = parseInt(planId, 10);
        this.selectedPlan = this.plans.find((plan) => plan.id === id) || null;
        if (!this.selectedPlan) this.router.navigateByUrl('/');
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  private setupStepTracker(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => this.updateCurrentStep());
    this.updateCurrentStep();
  }

  private updateCurrentStep(): void {
    switch (this.currentSection) {
      case Section.ChosenPlan:
        this.currentStep = 1;
        break;
      case Section.PayPage:
        this.currentStep = 2;
        break;
      case Section.donePage:
        this.currentStep = 3;
        break;
      default:
        this.currentStep = 1;
    }
  }

  goBack(): void {
    switch (this.currentSection) {
      case Section.ChosenPlan:
        this.location.back();
        break;
      case Section.PayPage:
        this.goToSection(Section.ChosenPlan);
        break;
      case Section.donePage:
        this.router.navigateByUrl('/');
        break;
      default:
        this.router.navigateByUrl('/');
    }
  }

  goToSection(section: Section): void {
    this.currentSection = section;
    this.updateCurrentStep();
  }

  pay(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.goToSection(Section.donePage);
  }

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  getFormattedPrice(): string {
    if (!this.selectedPlan) return '$0.00';
    const { price } = this.selectedPlan;
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

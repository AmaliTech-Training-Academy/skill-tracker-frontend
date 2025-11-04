import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { InputFieldComponent } from '@app/shared';
import { PlanLevels } from '@app/shared/compomonents/plan-levels/plan-levels';
import { getFormControl } from '@app/shared';

export enum Section {
  ChosenPlan = 'chosen-plan',
  PayPage = 'pay-page',
  DonePage = 'done-page',
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
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputFieldComponent, PlanLevels],
  templateUrl: './plan-confirmation.html',
  styleUrls: ['./plan-confirmation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanConfirmation implements OnDestroy, OnInit {
  public section = Section;
  private destroy$ = new Subject<void>();
  public getFormControl = getFormControl;

  public currentSection: Section = Section.ChosenPlan;
  public selectedPlan: Plan | null = null;
  public currentStep = 1;

  public paymentForm: FormGroup = new FormBuilder().group({
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

  public get planName(): string {
    return this.selectedPlan?.name ?? '';
  }

  public get features(): string[] {
    return this.selectedPlan?.features ?? [];
  }

  public get planPrice(): number {
    return this.selectedPlan?.price ?? 0;
  }

  public get chosenPlanSection(): Section {
    return Section.ChosenPlan;
  }

  public get payPageSection(): Section {
    return Section.PayPage;
  }

  public get donePageSection(): Section {
    return Section.DonePage;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const planId =
      this.route.snapshot.paramMap.get('plan-id') ||
      this.route.snapshot.paramMap.get('id') ||
      this.route.snapshot.paramMap.get('planId');

    if (planId) {
      const id = parseInt(planId, 10);
      this.selectedPlan = this.plans.find((plan) => plan.id === id) || null;

      if (!this.selectedPlan) {
        this.router.navigateByUrl('/');
      } else {
        this.cdr.markForCheck();
      }
    } else {
      this.router.navigateByUrl('/');
    }

    this.setupStepTracker();
  }

  private setupStepTracker(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
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
      case Section.DonePage:
        this.currentStep = 3;
        break;
      default:
        this.currentStep = 1;
    }
  }

  public goBack(): void {
    switch (this.currentSection) {
      case Section.ChosenPlan:
        this.router.navigateByUrl('/');
        break;
      case Section.PayPage:
        this.goToSection(Section.ChosenPlan);
        break;
      case Section.DonePage:
        this.router.navigateByUrl('/');
        break;
      default:
        this.router.navigateByUrl('/');
    }
  }

  public goToSection(section: Section): void {
    this.currentSection = section;
    this.updateCurrentStep();
    this.cdr.markForCheck();
  }

  public pay(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.goToSection(Section.DonePage);
  }

  public goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  public getFormattedPrice(): string {
    if (!this.selectedPlan) return '$0.00';
    const { price } = this.selectedPlan;
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

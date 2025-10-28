import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFieldComponent } from '@app/shared';
import { PlanLevels } from '@app/shared/compomonents/plan-levels/plan-levels';
import { getFormControl } from '@app/shared';
import { filter } from 'rxjs/operators';

type SectionType = 'chosen-plan' | 'pay-page' | 'done-page';

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
})
export class PlanConfirmation implements OnInit {
  getFormControl = getFormControl;
  paymentForm!: FormGroup;
  currentSection: SectionType = 'chosen-plan';
  selectedPlan: Plan | null = null;
  currentStep = 1; 

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
        'Preview Skill Arena'
      ]
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
        'Unlock leaderboard, ranks, and achievements'
      ]
    },
    {
      id: 3,
      name: 'Elite',
      price: 19.00,
      features: [
        'Everything in Pro, plus:',
        'Advanced AI-adaptive curriculum',
        'Live expert feedback and review sessions',
        'Monthly skill competitions with rewards',
        'Completion certificates for each track',
        'Early access to new Skill Arena game modes'
      ]
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializePaymentForm();
    this.loadPlanFromRoute();
    this.setupStepTracker(); 
  }

  private initializePaymentForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      fullName: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  private loadPlanFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      const planId = params.get('plan-id');
      if (planId) {
        const id = parseInt(planId, 10);
        this.selectedPlan = this.plans.find(plan => plan.id === id) || null;
        
        if (!this.selectedPlan) {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private setupStepTracker(): void {
  
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentStep();
      });

    this.updateCurrentStep(); 
  }

  private updateCurrentStep(): void {
    switch (this.currentSection) {
      case 'chosen-plan':
        this.currentStep = 1;
        break;
      case 'pay-page':
        this.currentStep = 2;
        break;
      case 'done-page':
        this.currentStep = 3;
        break;
    }
  }

  goBack(): void {
    if (this.currentSection === 'chosen-plan') {
      this.location.back();
    } 
    else if (this.currentSection === 'pay-page') {
      this.goToSection('chosen-plan');
    } 
    else if (this.currentSection === 'done-page') {
      this.router.navigate(['/']);
    }
  }

  goToSection(section: SectionType): void {
    this.currentSection = section;
    this.updateCurrentStep(); 
  }

  pay(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.goToSection('done-page');
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getFormattedPrice(): string {
    if (!this.selectedPlan) return '$0.00';
    return this.selectedPlan.price === 0 
      ? 'Free' 
      : `$${this.selectedPlan.price.toFixed(2)}`;
  }
}

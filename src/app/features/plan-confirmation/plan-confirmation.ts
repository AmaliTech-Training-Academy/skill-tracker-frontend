import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFieldComponent } from '@app/shared';
import { getFormControl } from '@app/shared';

type SectionType = 'chosen-plan' | 'pay-page' | 'done-page';

@Component({
  selector: 'app-plan-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './plan-confirmation.html',
  styleUrls: ['./plan-confirmation.scss'],
})
export class PlanConfirmation implements OnInit {
  getFormControl = getFormControl;
  paymentForm!: FormGroup;
  currentSection: SectionType = 'chosen-plan';

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      fullName: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
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
}
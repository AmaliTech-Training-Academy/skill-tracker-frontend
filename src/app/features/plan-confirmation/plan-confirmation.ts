import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputFieldComponent } from '@app/shared';
import { getFormControl } from '@app/shared';

@Component({
  selector: 'app-plan-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './plan-confirmation.html',
  styleUrls: ['./plan-confirmation.scss'],
})
export class PlanConfirmation {
  getFormControl = getFormControl;
  paymentForm!: FormGroup; // ✅ define first, initialize later

  constructor(
    private router: Router,
    private location: Location,
    private fb: FormBuilder
  ) {}

  // ✅ Safe initialization without using fb before setup
  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      fullName: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });
  }

  goBack(): void {
    this.location.back();
  }

  pay(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    console.log('Payment data:', this.paymentForm.value);
    alert('Payment successful!');
  }
}

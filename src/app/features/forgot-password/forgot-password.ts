import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword {
  email = '';
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  sendlink() {
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    this.forgotPasswordService.sendResetLink(this.email).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }

  trynewemail() {
    this.email = '';
    this.successMessage = '';
    this.errorMessage = '';
  }
}

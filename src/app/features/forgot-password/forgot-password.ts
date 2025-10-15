import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
})
export class ForgotPassword implements OnDestroy {
  public email = '';
  public successMessage = '';
  public errorMessage = '';
  public loading = false;

  private subscription?: Subscription;

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  public sendlink(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    this.subscription?.unsubscribe();

    this.subscription = this.forgotPasswordService.sendResetLink(this.email).subscribe({
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

  public trynewemail(): void {
    this.email = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

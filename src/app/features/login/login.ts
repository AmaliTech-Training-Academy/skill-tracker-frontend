import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from './login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnDestroy {
  public successMessage = '';
  public errorMessage = '';
  public email = '';
  public password = '';
  public showPassword = false;
  public loading = false;

  // active subscriptions
  private subscription?: Subscription;

  constructor(
    private loginService: LoginService,
    private faLibrary: FaIconLibrary,
  ) {
    this.faLibrary.addIcons(faEye, faEyeSlash);
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public login(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.loading = true;

    // Clean up any previous subscription before making a new one
    this.subscription?.unsubscribe();

    this.subscription = this.loginService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message ?? 'Login failed';
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

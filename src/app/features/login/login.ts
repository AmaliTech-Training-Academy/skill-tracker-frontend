import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye as farEye, faEyeSlash as farEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  successMessage = '';
  errorMessage = '';
  email = '';
  password = '';
  showPassword = false;

  // make icons accessible to the template
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private faLibrary: FaIconLibrary,
    private loginService: LoginService,
  ) {
    this.faLibrary.addIcons(faEye, faEyeSlash, farEye, farEyeSlash);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.successMessage = '';
    this.errorMessage = '';

    this.loginService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.successMessage = response.message;
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
    });
  }
}

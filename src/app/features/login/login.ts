import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye as farEye, faEyeSlash as farEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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

  faEye = farEye;
  faEyeSlash = farEyeSlash;

  constructor(private faLibrary: FaIconLibrary) {
    this.faLibrary.addIcons(faEye, faEyeSlash, farEye, farEyeSlash);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.email === 'user@example.com' && this.password === 'password') {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid email or password.';
      this.successMessage = '';
    }
  }
}

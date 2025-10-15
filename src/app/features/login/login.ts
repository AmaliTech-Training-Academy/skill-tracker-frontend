import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  successMessage: string = '';
  errorMessage: string = '';
  email: string = '';
  password: string = '';

  login() {
    // Simulate a login process
    if (this.email === 'user@example.com' && this.password === 'password') {
      this.successMessage = 'Login successful!';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Invalid email or password.';
      this.successMessage = '';
    }
  }
}

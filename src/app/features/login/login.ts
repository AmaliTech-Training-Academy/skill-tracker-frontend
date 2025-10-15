import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from './login.service';
import { InputFieldComponent } from '../../shared/input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterLink, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  successMessage = '';
  errorMessage = '';
  loading = false;
  loginForm!: FormGroup; // ✅ Declare it, don’t initialize yet

  constructor(
    private fb: FormBuilder,
    private faLibrary: FaIconLibrary,
    private loginService: LoginService,
  ) {
    // ✅ Initialize inside constructor (now fb is ready)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.faLibrary.addIcons(faEye, faEyeSlash);
  }

  // ✅ Explicit casts to FormControl
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.loginService.login(email, password).subscribe({
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
}

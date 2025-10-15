import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api-service';

export interface AuthResponse {
  token: string;
  user: { id: number; name: string; email: string };
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly currentUser = signal<AuthResponse['user'] | null>(null);

  login(payload: LoginRequest) {
    return this.api.post<AuthResponse>('auth/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      },
      error: () => this.logout(),
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

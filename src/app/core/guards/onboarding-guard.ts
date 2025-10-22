import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const onboardingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const hasCompleted = authService.hasCompletedOnboarding();

  if (hasCompleted) {
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true;
};

import { Router } from "@angular/router";

export function goToSignUp(router: Router): void{
    router.navigateByUrl('/signup');
}

export function goToLogin(router: Router): void{
    router.navigateByUrl('/login');
}

export function goToDashboard(router: Router): void{
    router.navigateByUrl('/dashboard');
}

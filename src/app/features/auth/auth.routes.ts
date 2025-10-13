import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Verifyemail } from './pages/verifyemail/verifyemail';
import { Forgotpassword } from './pages/forgotpassword/forgotpassword';
import { Resetpassword } from './pages/resetpassword/resetpassword';

export const authRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'verifyemail', component: Verifyemail },
  { path: 'forgotpassword', component: Forgotpassword },
  { path: 'resetpassword', component: Resetpassword },
];

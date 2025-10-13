import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Planconfirmation } from './planconfirmation/planconfirmation';
import { Pay } from './pay/pay';
import { Paymentsuccess } from './paymentsuccess/paymentsuccess';

export const planRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: ':id/confirm', component: Planconfirmation, title: 'Plan Confirmation' },
      { path: ':id/pay', component: Pay, title: 'Pay' },
      { path: 'paymentsuccess', component: Paymentsuccess, title: 'Payment Success' },
    ],
  },
];


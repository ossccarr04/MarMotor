import { Routes } from '@angular/router';
import { Home } from './module/components/home/home';
import { Login } from './module/components/login/login';
import { Register } from './module/components/register/register';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

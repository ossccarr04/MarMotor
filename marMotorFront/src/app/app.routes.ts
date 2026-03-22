import { Routes } from '@angular/router';
import { Home } from './module/components/home/home';
import { Login } from './module/components/login/login';
import { Register } from './module/components/register/register';
import { DetailCar } from './module/components/detail-car/detail-car';

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
    path: 'detail-car/:id',
    component: DetailCar,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

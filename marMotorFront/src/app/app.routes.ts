import { Routes } from '@angular/router';
import { Home } from './module/components/home/home';
import { Login } from './module/components/auth/login/login';
import { Register } from './module/components/auth/register/register';
import { DetailCar } from './module/components/detail-car/detail-car';
import { Cars } from './module/components/cars/cars';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'auth/login',
    component: Login,
  },
  {
    path: 'auth/register',
    component: Register,
  },
  {
    path: 'coches',
    component: Cars,
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

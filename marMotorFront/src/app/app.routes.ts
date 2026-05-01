import { Routes } from '@angular/router';
import { Home } from './module/components/home/home';
import { Login } from './module/components/auth/login/login';
import { Register } from './module/components/auth/register/register';
import { DetailCar } from './module/components/detail-car/detail-car';
import { Cars } from './module/components/cars/cars';
import { AnadirCoche } from './module/components/anadir-coche/anadir-coche';
import { Profile } from './module/components/profile/profile';
import { adminGuard } from './guards/admin-guard';
import { Company } from './module/components/company/company';
import { ForgotPassword } from './module/components/forgot-password/forgot-password';
import { ResetPassword } from './module/components/reset-password/reset-password';

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
    path: 'auth/reset-password',
    component: ResetPassword
  },
  {
    path: 'detail-car/:id',
    component: DetailCar,
  },
  {
    path:'users/me/profile',
    component: Profile
  },
  {
    path: 'company',
    component: Company
  },
  {
    path: 'cars',
    children: [
      {
        path: '',
        component: Cars,
      },
      {
        path: 'create-car',
        component: AnadirCoche,
        canActivate: [adminGuard]
      },
      {
        path: 'edit-car/:id',
        component: AnadirCoche,
        canActivate: [adminGuard]
      }
    ],
  },
  
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

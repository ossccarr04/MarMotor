import { Routes } from '@angular/router';
import { Home } from './module/components/home/home';
export const routes: Routes = [
    {
        path: '',
        component: Home
    }, {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];

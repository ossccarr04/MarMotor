import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceBBDD } from '../module/services/auth-service';
import { UserRoles } from '../@types/enums/roles.enums';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServiceBBDD);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  // Decodificamos el rol que guardaste en base64
  const role = user ? atob(user.role) : '';

  if (role === UserRoles.ADMIN.toUpperCase()) {
    return true; 
  }


  router.navigate(['/']);
  return false;
};

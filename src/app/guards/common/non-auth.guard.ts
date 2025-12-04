import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/common/auth.service';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  authService.identityCheck();

  if (authService.isAuthenticated) {
    router.navigate(["/"]); 
    return false; 
  }
  return true; 
};
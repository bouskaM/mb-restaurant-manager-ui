import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Sync login status from local storage (user might be looged out in another tab, or the token might be expired etc.)
  auth.syncLoginStatus();

  console.log("Auth guard check:", auth.isLoggedIn());
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
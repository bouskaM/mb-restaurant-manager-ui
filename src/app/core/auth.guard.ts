import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Route guard that prevents access to protected routes if the user is not logged in.
 * @returns True if the user is logged in, otherwise redirects to /login and returns false.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Sync login status from localStorage (in case of logout in another tab, etc.)
  auth.syncLoginStatus();

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

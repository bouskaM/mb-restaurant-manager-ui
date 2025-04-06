import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

// Assignment note:
// Unauthorised entry to endpoints lead to 401 error and disconnect

/**
 * Intercepts HTTP responses to handle unauthorized (401) errors.
 * @returns Modified HTTP response stream.
 * @note Logs out the user and redirects to /login on 401 response.
 */
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401) {
          console.error('Unauthorized request. Logging out...');
          authService.logout();
          router.navigate(['/login']);
        }
      }
    })
  );
};

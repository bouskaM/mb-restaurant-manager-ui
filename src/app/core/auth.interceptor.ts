import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
      }
    })
  );
};

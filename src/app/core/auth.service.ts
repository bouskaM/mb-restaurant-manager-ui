import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { catchError, of, tap, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  isLoggedIn = signal<boolean>(this.checkLoginStatus());
  loginError = signal<string | null>(null);

  private checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  syncLoginStatus(): void {
    this.isLoggedIn.set(this.checkLoginStatus());
  }

  async login(username: string, password: string): Promise<void> {
    const payload: LoginRequest = { username, password };

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiBaseUrl}/api/login`, payload).pipe(
          tap(() => {
            this.setLoginStatus(true);
            this.loginError.set(null);
          }),
          catchError((error: HttpErrorResponse) => {
            this.loginError.set(
              error.error?.message || 'An unexpected error occurred.'
            );
            return of(null);
          })
        )
      );

      if (!response) return;
    } catch (err) {
      this.loginError.set('An unexpected error occurred.');
    }
  }

  logout(): void {
    this.clearLoginStatus();
  }

  private setLoginStatus(loggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', String(loggedIn));
    this.isLoggedIn.set(loggedIn);
    this.loginError.set(null);
  }

  private clearLoginStatus(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn.set(false);
    this.loginError.set(null);
  }
}

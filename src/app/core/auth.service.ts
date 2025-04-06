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

  /**
   * Checks whether the user is currently logged in based on localStorage.
   * @note
   * In real application, this would be replaced with a more secure method e.g. JWT token validation
   */
  private checkLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  /** Syncs the isLoggedIn signal with localStorage */
  syncLoginStatus(): void {
    this.isLoggedIn.set(this.checkLoginStatus());
  }

  /**
   * Attempts to log in the user with provided credentials.
   * Sets login state and handles errors appropriately.
   * @param username - The user's username
   * @param password - The user's password
   */
  async login(username: string, password: string): Promise<void> {
    const payload: LoginRequest = { username, password };

    try {
      const response = await firstValueFrom(
        this.http
          .post<LoginResponse>(`${environment.apiBaseUrl}/api/login`, payload)
          .pipe(
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

  /** Logs the user out and clears login status */
  logout(): void {
    this.clearLoginStatus();
  }

  /**
   * Sets the login status in localStorage and updates signals
   * @param loggedIn - Whether the user is logged in
   */
  private setLoginStatus(loggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', String(loggedIn));
    this.isLoggedIn.set(loggedIn);
    this.loginError.set(null);
  }

  /** Clears the login status from localStorage and resets signals */
  private clearLoginStatus(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn.set(false);
    this.loginError.set(null);
  }
}

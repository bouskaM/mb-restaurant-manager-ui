import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  isLoggedIn = signal<boolean>(this.checkLoginStatus());
  loginError = signal<string | null>(null);

  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http
          .post<LoginResponse>(`${environment.apiBaseUrl}/api/login`, {
            username,
            password,
          })
          .pipe(
            tap(() => {
              this.setLoginStatus(true);
              this.loginError.set(null);
            }),
            catchError((error: HttpErrorResponse) => {
              console.error('Login error:', error);
              this.loginError.set(
                error.error?.message || 'An unexpected error occurred.'
              );
              return of(null);
            })
          )
      );

      if (!response) {
        return;
      }
    } catch (error) {
      this.loginError.set('An unexpected error occurred.');
      console.error('Login error:', error);
    }
  }

  private setLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    this.isLoggedIn.set(isLoggedIn);
  }
  
  private clearLoginStatus(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn.set(false);
  }


  logout(): void {
    this.clearLoginStatus();
  }
}
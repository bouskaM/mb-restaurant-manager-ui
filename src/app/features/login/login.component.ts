import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
  template: `
    <div class="login-container">
      <ng-container *ngIf="!isRedirecting(); else redirecting">
        <h2>Login</h2>

        <form (ngSubmit)="login()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" name="username" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              [(ngModel)]="password"
              name="password"
              type="password"
              required
            />
          </mat-form-field>

          <button
            mat-raised-button
            [disabled]="!isFormValid()"
            color="primary"
            class="full-width"
          >
            Login
          </button>
        </form>

        <p *ngIf="error()" class="error">{{ error() }}</p>
      </ng-container>

      <ng-template #redirecting>
        <div class="redirecting">
          <div class="spinner"></div>
          <p class="pulsing">Redirecting to dashboard...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 50px auto;
      }

      .full-width {
        width: 100%;
        margin-bottom: 20px;
      }

      .error {
        color: red;
      }

      .redirecting {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 4px solid #ccc;
        border-top: 4px solid #3f51b5;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }

      .pulsing {
        animation: pulse 1.5s ease-in-out infinite;
        text-align: center;
      }

      @keyframes spin {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 0.4;
        }
        50% {
          opacity: 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly username = signal('');
  readonly password = signal('');
  readonly error = computed(() => this.authService.loginError());

  readonly isFormValid = computed(
    () => this.username().trim() !== '' && this.password().trim() !== ''
  );

  readonly isRedirecting = computed(() => this.authService.isLoggedIn());

  readonly redirectEffect = effect((onCleanup) => {
    if (this.authService.isLoggedIn()) {
      const timeout = setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);

      onCleanup(() => clearTimeout(timeout));
    }
  });

  async login() {
    await this.authService.login(this.username(), this.password());

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }
}

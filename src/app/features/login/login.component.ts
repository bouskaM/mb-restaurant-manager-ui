import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

  async login() {
    await this.authService.login(this.username(), this.password());
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="not-found-card">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>

      <button
        mat-raised-button
        color="primary"
        *ngIf="isLoggedIn(); else loginLink"
        routerLink="/dashboard"
      >
        Go to Dashboard
      </button>

      <ng-template #loginLink>
        <button mat-raised-button color="primary" routerLink="/">
          Home
        </button>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    .not-found-card {
      max-width: 500px;
      margin: 100px auto;
      padding: 24px;
      text-align: center;
    }

    button {
      margin-top: 20px;
    }
  `]
})
export class NotFoundComponent {
  private auth = inject(AuthService);

  isLoggedIn = this.auth.isLoggedIn;
}

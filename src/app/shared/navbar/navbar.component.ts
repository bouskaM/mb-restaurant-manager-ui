import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <mat-toolbar color="primary" class="navbar">
      <a
        mat-button
        routerLink="/dashboard"
        routerLinkActive="active-link"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        <mat-icon>dashboard</mat-icon>
        Dashboard
      </a>

      <span class="spacer"></span>

      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .navbar {
        display: flex;
        justify-content: space-between;
        padding: 0 16px;
      }

      .spacer {
        flex: 1;
      }

      .username {
        margin-right: 12px;
        font-weight: 500;
      }

      .active-link {
        font-weight: bold;
        background-color: rgba(255, 255, 255, 0.15);
        border-radius: 4px;
      }
    `,
  ],
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

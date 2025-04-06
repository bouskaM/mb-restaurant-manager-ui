import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

/**
 * A reusable card component for the dashboard.
 * Displays a title, description, and navigates to a given route on click.
 */
@Component({
  selector: 'app-dashboard-card',
  imports: [CommonModule, MatCardModule, RouterModule],
  template: `
    <mat-card class="module-card" [routerLink]="link()">
      <h2>{{ title() }}</h2>
      <p>{{ description() }}</p>
    </mat-card>
  `,
  styles: [`
    .module-card {
      width: 300px;
      cursor: pointer;
      text-align: center;
      transition: box-shadow 0.3s ease;
    }

    .module-card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    h2 {
      margin-bottom: 10px;
    }
  `]
})
export class DashboardCardComponent {
  title = input<string>('');
  description = input<string>('');
  link = input<string>('');
}

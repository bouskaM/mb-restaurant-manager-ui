import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { MatCardModule } from '@angular/material/card';

// Assignment note:
// Displays modules 
// Developer note: The modules would be shown with a reusable card component (app-dashboard-card).

/**
 * Main dashboard component displaying navigation cards for app modules.
 */
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardCardComponent, MatCardModule],
  template: `
    <mat-card class="dashboard-wrapper">
      <h1 class="dashboard-title">Dashboard</h1>
      <h2 class="section-heading">Currently available modules</h2>
      <div class="modules">
        <app-dashboard-card
          [title]="'Restaurants'"
          [description]="'Manage and view all restaurants'"
          [link]="'/restaurants'"
        />
      </div>
    </mat-card>
  `,
  styles: [`
    .dashboard-wrapper {
      max-width: 1200px;
      margin: 40px auto;
      padding: 32px;
    }

    .dashboard-title {
      margin-bottom: 24px;
      font-size: 24px;
    }

    .modules {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    
    .section-heading {
      align-self: center;
    }
  `]
})
export class DashboardComponent {}

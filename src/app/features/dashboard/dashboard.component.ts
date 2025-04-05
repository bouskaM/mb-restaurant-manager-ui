import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardCardComponent, MatCardModule],
  template: `
    <mat-card class="dashboard-wrapper">
      <h1 class="dashboard-title">Dashboard</h1>

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
      max-width: 1000px;
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
    }
  `]
})
export class DashboardComponent {}

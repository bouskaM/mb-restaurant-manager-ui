import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-restaurant-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-wrapper">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Loading restaurants...</p>
    </div>
  `,
  styles: [
    `
      .loading-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 60px 0;
      }

      p {
        margin-top: 16px;
        color: #666;
      }
    `,
  ],
})
export class RestaurantLoaderComponent {}

import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-restaurant-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="search-wrapper">
      <mat-form-field appearance="outline">
        <mat-label>Search</mat-label>
        <input
          matInput
          [ngModel]="search()"
          (ngModelChange)="onSearchChange($event)"
        />
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .search-wrapper {
        max-width: 400px;
        margin-bottom: 20px;
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class RestaurantSearchComponent {
  search = input<string>('');
  searchChange = output<string>();

  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }
}

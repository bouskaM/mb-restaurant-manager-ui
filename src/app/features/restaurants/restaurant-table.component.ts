import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-restaurant-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  template: `
    <table
      mat-table
      [dataSource]="data()"
      matSort
      (matSortChange)="sortChange.emit($event)"
      class="mat-elevation-z2"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
        <td mat-cell *matCellDef="let r">{{ r.id }}</td>
      </ng-container>

      <ng-container matColumnDef="address">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Address</th>
        <td mat-cell *matCellDef="let r">{{ r.address }}</td>
      </ng-container>

      <ng-container matColumnDef="manager">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Manager</th>
        <td mat-cell *matCellDef="let r">{{ r.managerName }}</td>
      </ng-container>

      <ng-container matColumnDef="inProduction">
        <th mat-header-cell *matHeaderCellDef>In Production</th>
        <td mat-cell *matCellDef="let r">
          {{ r.inProduction ? 'Yes' : 'No' }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns()"></tr>
      <tr mat-row *matRowDef="let row; columns: columns()"></tr>
    </table>
  `,
})
export class RestaurantTableComponent {
  data = input<any[]>([]);
  columns = input<string[]>([]);
  sortChange = output<Sort>();
}

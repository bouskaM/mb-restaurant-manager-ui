import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RestaurantsStore } from './restaurants.store';
import { RestaurantTableColumn } from '../../models/restaurants.model';

@Component({
  selector: 'app-restaurants',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-card>
      <h1>Restaurants</h1>

      <ng-container *ngIf="!isLoading(); else loading">
        <div class="search-wrapper">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="searchText" (ngModelChange)="onSearchChange($event)" />
          </mat-form-field>
        </div>

        <table mat-table
               [dataSource]="paginatedRestaurants()"
               matSort
               (matSortChange)="sortChange($event)"
               class="mat-elevation-z2">

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
            <td mat-cell *matCellDef="let r">{{ r.inProduction ? 'Yes' : 'No' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>

        <mat-paginator
          [length]="totalCount()"
          [pageSize]="pageSize()"
          [pageIndex]="pageIndex()"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
        ></mat-paginator>
      </ng-container>

      <ng-template #loading>
        <div class="loading-wrapper">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading restaurants...</p>
        </div>
      </ng-template>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 1200px;
      margin: 40px auto;
      padding: 24px;
    }

    h1 {
      margin-bottom: 24px;
    }

    .search-wrapper {
      max-width: 400px;
      margin-bottom: 20px;
    }

    .search-wrapper mat-form-field {
      width: 100%;
    }

    table {
      width: 100%;
      margin-bottom: 20px;
    }

    mat-paginator {
      display: flex;
      justify-content: center;
    }

    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 60px 0;
    }

    .loading-wrapper p {
      margin-top: 16px;
      color: #666;
    }
  `],
})
export class RestaurantsComponent {
  private readonly store = inject(RestaurantsStore);

  readonly paginatedRestaurants = this.store.paginatedRestaurantsWithManagerName;
  readonly pageIndex = this.store.pageIndex;
  readonly pageSize = this.store.pageSize;
  readonly totalCount = this.store.totalFilteredCount;
  readonly isLoading = this.store.isLoading;
  readonly displayedColumns: RestaurantTableColumn[] = [
    'id',
    'address',
    'manager',
    'inProduction',
  ];

  searchText = this.store.searchTerm();

  readonly loadEffect = effect(() => {
    this.store.load();
  });

  onSearchChange(value: string) {
    this.store.setSearchTerm(value);
  }

  onPageChange(event: PageEvent) {
    this.store.setPage(event.pageIndex, event.pageSize);
  }

  sortChange(sortState: Sort) {
    this.store.setSort(sortState.active as any);
    this.store.sortDirection.set(sortState.direction);
  }
}
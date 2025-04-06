import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { RestaurantsStore } from './restaurants.store';
import { RestaurantTableColumn } from '../../models/restaurants.model';

// Local signal-based components
import { RestaurantSearchComponent } from './restaurant-search.component';
import { RestaurantTableComponent } from './restaurant-table.component';
import { RestaurantPaginatorComponent } from './restaurant-paginator.component';
import { RestaurantLoaderComponent } from './restaurant-loader.component';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RestaurantSearchComponent,
    RestaurantTableComponent,
    RestaurantPaginatorComponent,
    RestaurantLoaderComponent,
  ],
  template: `
    <mat-card>
      <h1>Restaurants</h1>

      <p *ngIf="error()" class="error-msg">{{ error() }}</p>

      <app-restaurant-loader *ngIf="isLoading(); else content" />

      <ng-template #content>
        <app-restaurant-search
          [search]="searchText"
          (searchChange)="onSearchChange($event)"
        />

        <app-restaurant-table
          [data]="paginatedRestaurants()"
          [columns]="displayedColumns"
          (sortChange)="sortChange($event)"
        />

        <app-restaurant-paginator
          [length]="totalCount()"
          [pageSize]="pageSize()"
          [pageIndex]="pageIndex()"
          (pageChange)="onPageChange($event)"
        />
      </ng-template>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 1200px;
        margin: 40px auto;
        padding: 24px;
      }

      h1 {
        margin-bottom: 24px;
      }

      .error-msg {
        color: red;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class RestaurantsComponent {
  private readonly store = inject(RestaurantsStore);

  readonly paginatedRestaurants =
    this.store.paginatedRestaurantsWithManagerName;
  readonly pageIndex = this.store.pageIndex;
  readonly pageSize = this.store.pageSize;
  readonly totalCount = this.store.totalFilteredCount;
  readonly isLoading = this.store.isLoading;
  readonly error = this.store.error;
  readonly displayedColumns: RestaurantTableColumn[] = [
    'id',
    'address',
    'manager',
    'inProduction',
  ];

  searchText = this.store.searchTerm();

  /** Load data on component init */
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
